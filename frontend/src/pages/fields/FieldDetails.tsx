import { useParams, useNavigate } from "react-router-dom";
import { useGetFieldByIdQuery } from "@/features/fields/fieldApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { ArrowLeft, UserPlus, Calendar, MapPin, User as UserIcon } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useMemo } from "react";
import type { User } from "@/types/types"; // Removed unused Field import from here if not used elsewhere

/* ================= INFO ROW PROPS ================= */
interface InfoProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}

export default function FieldDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === "admin";

  const fieldId = id ? Number(id) : null;

  // 1. Fetch Field Data
  const { data: field, isLoading: isFieldLoading } = useGetFieldByIdQuery(
    fieldId as number,
    { skip: fieldId === null }
  );

  // 2. Fetch Users
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();

  // 3. Resolve the Agent Name
  // FIX: Use 'field' and 'usersData' as dependencies to satisfy the compiler
  const assignedAgent = useMemo(() => {
    if (!field?.assignedAgentId || !usersData) return null;
    
    // Ensure we are working with an array of Users
    const users = usersData as User[];
    return users.find((u) => u.id === field.assignedAgentId) || null;
  }, [field, usersData]); 

  /* ================= LOADING & ERROR ================= */
  if (isFieldLoading || isUsersLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 animate-pulse font-medium">Fetching field details...</p>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Field not found</h2>
        <button onClick={() => navigate("/fields")} className="mt-4 text-green-600 font-medium hover:underline">
          Go back to Fields
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/fields")}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Fields
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="bg-green-600 h-24 sm:h-32 w-full relative">
          <div className="absolute -bottom-6 left-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
            <MapPin size={24} className="text-green-600" />
          </div>
        </div>

        <div className="pt-10 p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {field.name}
              </h1>
              <p className="text-slate-500 flex items-center gap-1 font-medium mt-1">
                {field.cropType} • <span className="capitalize">{field.currentStage}</span>
              </p>
            </div>
            
            <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm font-bold uppercase tracking-wide border border-green-100 dark:border-green-800/50">
              {field.currentStage}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Info 
              label="Location" 
              value={field.location || "Coordinates not set"} 
              icon={<MapPin size={16} className="text-slate-400" />} 
            />
            <Info 
              label="Planting Date" 
              value={field.plantingDate ? new Date(field.plantingDate).toLocaleDateString() : "Not recorded"} 
              icon={<Calendar size={16} className="text-slate-400" />} 
            />
            <Info 
              label="Expected Harvest" 
              value={field.expectedHarvestDate ? new Date(field.expectedHarvestDate).toLocaleDateString() : "Pending"} 
              icon={<Calendar size={16} className="text-slate-400" />} 
            />
            
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <UserIcon size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Assigned Agent</p>
                <p className="text-slate-900 dark:text-white font-semibold">
                  {assignedAgent?.fullName || "No Agent Assigned"}
                </p>
                {assignedAgent && <p className="text-xs text-slate-500">{assignedAgent.email}</p>}
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <button
                onClick={() => navigate(`/fields/${field.id}/assign`)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-md"
              >
                <UserPlus size={18} /> 
                {field.assignedAgentId ? "Reassign Agent" : "Assign Agent"}
              </button>
            )}
            <button
               onClick={() => navigate(`/fields/${field.id}/edit`)}
               className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon }: InfoProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-slate-900 dark:text-white font-medium pl-5">
        {value}
      </p>
    </div>
  );
}