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
      active: fields.filter(f => 
        f.currentStage !== 'harvested'
      ).length,
      completed: fields.filter(f => 
        f.currentStage === 'harvested'
      ).length,
    };
  }, [data]);

  if (isLoading) return <AgentSkeleton />;

  if (isError) {
    return (
      <div className="mt-10 p-6 md:p-10 bg-white dark:bg-slate-900 border-2 border-dashed border-red-200 dark:border-slate-800 rounded-[2.5rem] text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Connection Issue</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2 text-sm">
          We couldn't retrieve your assigned fields. Please check your internet.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-8 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-600/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const fields: Field[] = data?.fields ?? [];

  return (
    <div className={`space-y-6 md:space-y-8 pb-10 transition-all duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}>

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-600/10 rounded-2xl">
            <ClipboardList className="text-green-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Agent Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, <span className="text-green-600 font-bold">{user?.fullName?.split(' ')[0] ?? "Agent"}</span>
            </p>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Assigned" 
          value={stats.total} 
          icon={<ClipboardList size={22} />} 
          color="text-green-600" 
          bgColor="bg-green-600/10" 
        />
        <StatCard 
          title="Active" 
          value={stats.active} 
          icon={<Clock size={22} />} 
          color="text-amber-500" 
          bgColor="bg-amber-500/10" 
        />
        <StatCard 
          title="Harvested" 
          value={stats.completed} 
          icon={<CheckCircle2 size={22} />} 
          color="text-emerald-500" 
          bgColor="bg-emerald-500/10" 
        />
      </div>

      {/* ASSIGNED FIELDS LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              My Assignments
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Field monitoring tasks for your profile
            </p>
          </div>
          <div className="hidden sm:block text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-slate-500 dark:text-slate-400 tracking-widest">
            {fields.length} TOTAL
          </div>
        </div>

        <div className="p-4 md:p-8">
          {fields.length > 0 ? (
            <div className="grid gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="
                    group p-4 md:p-5
                    bg-slate-50 dark:bg-slate-800/40
                    hover:bg-green-50 dark:hover:bg-green-900/10
                    rounded-[1.5rem] md:rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center
                    border border-slate-100 dark:border-slate-800
                    transition-all duration-200 cursor-pointer
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-green-600 shadow-sm transition-transform group-hover:rotate-12">
                      <Leaf size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-green-600 transition-colors truncate">
                        {field.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-green-600">{field.cropType}</span>
                        {field.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {field.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-6">
                    <StageBadge stage={field.currentStage} />
                    <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-green-600 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-4 text-slate-200 dark:text-slate-700">
                <Search size={48} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                No active field assignments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
      <div className={`w-12 h-12 flex items-center justify-center ${bgColor} ${color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <p className="text-4xl font-black text-slate-900 dark:text-white">
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
      styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/20";
      break;
    case "growing":
      styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/20";
      break;
    case "ready":
      styles = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50 dark:border-green-900/20";
      break;
    case "harvested":
      styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/20";
      break;
  }

  return (
    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm transition-colors ${styles}`}>
      {stage}
    </span>
  );
}

const AgentSkeleton = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />)}
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
  </div>
);