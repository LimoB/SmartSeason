import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useGetFieldByIdQuery } from "../../features/fields/fieldApi";
import { useGetUsersQuery } from "../../features/users/userApi";
import { useAppSelector } from "../../app/hooks";
import {
  ArrowLeft,
  UserPlus,
  Calendar,
  MapPin,
  User as UserIcon,
  Pencil,
  CircleDot,
  Loader2
} from "lucide-react";
import type { User } from "../../types/types";

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

  const assignedAgent = useMemo(() => {
    const agentId = field?.assignedAgentId;
    if (!agentId || !usersData) return null;
    const users = usersData as User[];
    return users.find((u) => u.id === agentId) ?? null;
  }, [field, usersData]);

  if (isFieldLoading || (isAdmin && isUsersLoading)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Sector Data...</p>
      </div>
    );
  }

  if (!isValidId || !field) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Field Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">The plot you are looking for doesn't exist or has been decommissioned.</p>
        <button
          onClick={() => navigate("/fields")}
          className="flex items-center gap-2 mx-auto px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 pb-20">
      {/* TOP NAVIGATION */}
      <div className="px-3 md:px-0">
        <button
          onClick={() => navigate("/fields")}
          className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-green-600 group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Inventory
        </button>
      </div>

      <div className="mx-3 md:mx-0 bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* HERO HEADER */}
        <div className="bg-green-600 h-28 md:h-40 w-full relative overflow-hidden">
            <div 
                className="absolute inset-0 opacity-10" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
                    backgroundSize: '24px 24px' 
                }} 
            />
            <div className="absolute -bottom-6 left-8 md:left-12 bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-xl border-4 border-slate-50 dark:border-slate-950">
                <MapPin size={28} className="text-green-600" />
            </div>
        </div>

        <div className="pt-12 p-6 md:p-12 space-y-10">
          {/* PRIMARY INFO */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{field.name}</h1>
                    <StageBadge stage={field.currentStage} />
                </div>
                <p className="text-sm md:text-base font-bold text-green-600 flex items-center gap-2">
                    <CircleDot size={16} />
                    {field.cropType} Cultivation
                </p>
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {isAdmin && (
                <button
                  onClick={() => navigate(`/fields/${field.id}/assign`)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all text-sm"
                >
                  <UserPlus size={18} />
                  {field.assignedAgentId ? "Reassign Agent" : "Assign Agent"}
                </button>
              )}
              <button
                onClick={() => navigate(`/fields/${field.id}/edit`)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all text-sm"
              >
                <Pencil size={18} />
                Edit Plot
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

          {/* ATTRIBUTES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Info
              label="Geo-Location"
              value={field.location || "Central Sector"}
              icon={<MapPin size={14} className="text-green-600" />}
            />

            <Info
              label="Planting Schedule"
              value={field.plantingDate ? new Date(field.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not Scheduled"}
              icon={<Calendar size={14} className="text-green-600" />}
            />

            <Info
              label="Expected Harvest"
              value={field.expectedHarvestDate ? new Date(field.expectedHarvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Analysis Pending"}
              icon={<Calendar size={14} className="text-green-600" />}
            />
          </div>

          {/* AGENT CARD - Premium Style */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-green-600/10 flex items-center justify-center text-green-600 border border-green-600/20">
                <UserIcon size={28} />
            </div>
            <div className="text-center sm:text-left flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personnel Responsible</p>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  {assignedAgent?.fullName || "Unassigned"}
                </h3>
                {assignedAgent ? (
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{assignedAgent.email}</p>
                ) : (
                  <p className="text-xs font-medium text-slate-400 italic">No agent has been assigned to this sector yet.</p>
                )}
            </div>
            {!assignedAgent && isAdmin && (
                <button 
                  onClick={() => navigate(`/fields/${field.id}/assign`)}
                  className="px-5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-green-600 rounded-lg font-black text-[10px] uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all"
                >
                    Assign Now
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
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="text-base md:text-lg font-black text-slate-900 dark:text-white truncate">
        {value}
      </p>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
    const s = stage.toLowerCase();
    let styles = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    
    if (s === 'planted') styles = "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    if (s === 'growing') styles = "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    if (s === 'ready' || s === 'harvested') styles = "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400";
  
    return (
      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${styles} shadow-sm`}>
        {stage}
      </span>
    );
}