import { useAppSelector } from "../../app/hooks";
import { useGetAgentDashboardQuery } from "../../features/dashboard/dashboardApi";
import { useMemo } from "react";
import type { Field, FieldStage } from "../../types/types"; 
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  ChevronRight,
  AlertCircle,
  Search,
} from "lucide-react";

/* ================= COMPONENT PROPS ================= */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function AgentDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAgentDashboardQuery();

  /* ================= CALCULATE STATS FROM DATA ================= */
  const stats = useMemo(() => {
    const fields: Field[] = data?.fields ?? [];
    
    return {
      total: fields.length,
      active: fields.filter(f => f.currentStage !== 'harvested').length,
      completed: fields.filter(f => f.currentStage === 'harvested').length,
    };
  }, [data]);

  if (isLoading) return <AgentSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Connection Issue</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2 text-sm font-medium">
          We couldn't retrieve your assigned fields.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 active:scale-95 transition-transform"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const fields: Field[] = data?.fields ?? [];

  return (
    <div className={`w-full space-y-4 md:space-y-8 pb-10 transition-all duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}>

      {/* HEADER - Flush left */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-3 md:px-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-600/10 rounded-xl">
            <ClipboardList className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Agent Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Welcome back, <span className="text-green-600 font-bold">{user?.fullName?.split(' ')[0] ?? "Agent"}</span>
            </p>
          </div>
        </div>
      </header>

      {/* STATS GRID - Flush edges on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 px-3 md:px-0">
        <StatCard 
          title="Assigned" 
          value={stats.total} 
          icon={<ClipboardList size={20} />} 
          color="text-green-600" 
          bgColor="bg-green-600/10" 
        />
        <StatCard 
          title="Active" 
          value={stats.active} 
          icon={<Clock size={20} />} 
          color="text-amber-500" 
          bgColor="bg-amber-500/10" 
        />
        <StatCard 
          title="Harvested" 
          value={stats.completed} 
          icon={<CheckCircle2 size={20} />} 
          color="text-emerald-500" 
          bgColor="bg-emerald-500/10" 
        />
      </div>

      {/* ASSIGNED FIELDS LIST */}
      <div className="px-3 md:px-0">
        <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                My Assignments
              </h2>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mt-1">
                Field monitoring tasks
              </p>
            </div>
            <div className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-500 dark:text-slate-400 tracking-widest">
              {fields.length} TOTAL
            </div>
          </div>

          <div className="p-3 md:p-8">
            {fields.length > 0 ? (
              <div className="grid gap-2 md:gap-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="
                      group p-4
                      bg-slate-50 dark:bg-slate-800/40
                      hover:bg-green-50 dark:hover:bg-green-900/10
                      rounded-2xl md:rounded-[2rem] flex flex-col sm:flex-row justify-between sm:items-center
                      border border-slate-100 dark:border-slate-800
                      transition-all duration-200 cursor-pointer
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-green-600 shadow-sm transition-transform group-hover:scale-105">
                        <Leaf size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors truncate text-sm md:text-base">
                          {field.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold">
                          <span className="text-green-600">{field.cropType}</span>
                          {field.location && (
                            <span className="flex items-center gap-1 opacity-70">
                              <MapPin size={10} /> {field.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                      <StageBadge stage={field.currentStage} />
                      <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-green-600 transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Search size={32} className="mx-auto mb-3 opacity-20 text-slate-400" />
                <p className="text-slate-400 dark:text-slate-500 font-bold italic text-sm">
                  No field assignments currently.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className={`w-10 h-10 flex items-center justify-center ${bgColor} ${color} rounded-xl mb-4`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
          {title}
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: FieldStage }) {
  let styles = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  
  switch (stage) {
    case "planted":
      styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      break;
    case "growing":
      styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      break;
    case "ready":
      styles = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      break;
    case "harvested":
      styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      break;
  }

  return (
    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter rounded-full shadow-sm ${styles} shrink-0`}>
      {stage}
    </span>
  );
}

const AgentSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse px-3 md:px-0">
    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />)}
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl md:rounded-[2.5rem]" />
  </div>
);