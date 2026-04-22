import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useGetFieldByIdQuery } from "@/features/fields/fieldApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { useAppSelector } from "@/app/hooks";
import {
  ArrowLeft,
  UserPlus,
  Calendar,
  MapPin,
  User as UserIcon,
  Pencil,
  CircleDot
} from "lucide-react";
import type { User } from "@/types/types";

/* ================= TYPES ================= */
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

  const fieldId = id ? Number(id) : undefined;
  const isValidId = fieldId !== undefined && !Number.isNaN(fieldId);

  /* ================= QUERIES ================= */
  const { data: field, isLoading: isFieldLoading } = useGetFieldByIdQuery(fieldId as number, {
    skip: !isValidId,
  });

  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery(undefined, {
    skip: !isAdmin
  });

  /* ================= RESOLVE AGENT (FIXED MEMO) ================= */
  // We use the full field object and usersData to satisfy the compiler's inference
  const assignedAgent = useMemo(() => {
    const agentId = field?.assignedAgentId;
    if (!agentId || !usersData) return null;
    
    const users = usersData as User[];
    return users.find((u) => u.id === agentId) ?? null;
  }, [field, usersData]);

  /* ================= STATES ================= */
  if (isFieldLoading || (isAdmin && isUsersLoading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Sector Data...</p>
      </div>
    );
  }

  if (!isValidId || !field) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-200 dark:border-dark-border">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Field Not Found</h2>
        <p className="text-gray-500 mb-6">The plot you are looking for doesn't exist or has been decommissioned.</p>
        <button
          onClick={() => navigate("/fields")}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold transition-transform active:scale-95"
        >
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* NAVIGATION */}
      <button
        onClick={() => navigate("/fields")}
        className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-500 transition-colors"
      >
        <div className="p-2 rounded-xl group-hover:bg-primary-500/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Back to All Fields
      </button>

      <div className="bg-white dark:bg-dark-surface rounded-[3rem] border border-gray-200 dark:border-dark-border shadow-xl overflow-hidden">
        {/* HERO SECTION */}
        <div className="bg-primary-600 h-32 sm:h-48 w-full relative overflow-hidden">
            {/* FIX: Corrected backgroundSize property */}
            <div 
                className="absolute inset-0 opacity-10" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
                    backgroundSize: '20px 20px' 
                }} 
            />
            <div className="absolute -bottom-8 left-10 bg-white dark:bg-dark-surface p-6 rounded-[2rem] shadow-lg border-4 border-gray-50 dark:border-dark-bg">
                <MapPin size={32} className="text-primary-500" />
            </div>
        </div>

        <div className="pt-14 p-10 space-y-10">
          {/* HEADER INFO */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{field.name}</h1>
                    <StageBadge stage={field.currentStage} />
                </div>
                <p className="text-lg font-bold text-primary-500 flex items-center gap-2">
                    <CircleDot size={18} />
                    {field.cropType} Production
                </p>
            </div>

            <div className="flex gap-3">
              {isAdmin && (
                <button
                  onClick={() => navigate(`/fields/${field.id}/assign`)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                >
                  <UserPlus size={18} />
                  {field.assignedAgentId ? "Reassign" : "Assign Agent"}
                </button>
              )}
              <button
                onClick={() => navigate(`/fields/${field.id}/edit`)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-dark-border transition-all"
              >
                <Pencil size={18} />
                Edit
              </button>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-dark-border" />

          {/* DETAILS GRID */}
          <div className="grid md:grid-cols-3 gap-8">
            <Info
              label="Operational Location"
              value={field.location || "North Rift Region"}
              icon={<MapPin size={18} className="text-primary-500" />}
            />

            <Info
              label="Planting Timeline"
              value={field.plantingDate ? new Date(field.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Awaiting Schedule"}
              icon={<Calendar size={18} className="text-primary-500" />}
            />

            <Info
              label="Expected Harvest"
              value={field.expectedHarvestDate ? new Date(field.expectedHarvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "TBD"}
              icon={<Calendar size={18} className="text-primary-500" />}
            />
          </div>

          {/* AGENT CARD */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 dark:bg-dark-bg/50 rounded-[2rem] border border-gray-100 dark:border-dark-border">
            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-inner">
                <UserIcon size={32} />
            </div>
            <div className="text-center sm:text-left flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Field Agent Responsible</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {assignedAgent?.fullName || "Awaiting Assignment"}
                </h3>
                {assignedAgent && (
                  <p className="text-sm font-medium text-gray-500">{assignedAgent.email}</p>
                )}
            </div>
            {!assignedAgent && isAdmin && (
                <button 
                  onClick={() => navigate(`/fields/${field.id}/assign`)}
                  className="text-primary-500 font-bold text-sm underline underline-offset-4"
                >
                    Assign someone now
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Info({ label, value, icon }: InfoProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
    const s = stage.toLowerCase();
    let styles = "bg-gray-100 text-gray-600";
    
    if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
    if (s === 'growing') styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
    if (s === 'ready' || s === 'harvested') styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
  
    return (
      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${styles}`}>
        {stage}
      </span>
    );
}