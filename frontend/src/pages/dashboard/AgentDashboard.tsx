import { useAppSelector } from "../../app/hooks";
import { useGetAgentDashboardQuery } from "../../features/dashboard/dashboardApi";
import { useMemo } from "react";
import type { Field, FieldStage } from "../../types/types"; 
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
  Search
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sync Failed</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2 text-xs font-bold leading-relaxed">
          We encountered an error retrieving your assigned sectors. Please check your connection.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-8 px-10 py-3.5 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-all"
        >
          Reconnect to Grid
        </button>
      </div>
    );
  }

  const fields: Field[] = data?.fields ?? [];

  return (
    <div className={`w-full transition-all duration-500 ${isFetching ? "opacity-60" : "opacity-100"}`}>

      {/* HEADER SECTION */}
      <header className="p-4 md:p-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <ClipboardList className="text-green-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Agent Terminal
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Operational tasks for <span className="text-green-500 font-bold">{user?.fullName ?? "Field Agent"}</span>
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 pt-0 space-y-6 md:space-y-10">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          <StatCard 
            title="Total Assignments" 
            value={stats.total} 
            icon={<ClipboardList size={24} />} 
            color="text-indigo-500" 
            bgColor="bg-indigo-500/10" 
          />
          <StatCard 
            title="Active Sectors" 
            value={stats.active} 
            icon={<Clock size={24} />} 
            color="text-orange-400" 
            bgColor="bg-orange-400/10" 
          />
          <StatCard 
            title="Harvested" 
            value={stats.completed} 
            icon={<CheckCircle2 size={24} />} 
            color="text-green-500" 
            bgColor="bg-green-500/10" 
          />
        </div>

        {/* ASSIGNMENTS LIST */}
        <section className="bg-white dark:bg-[#16112b] rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Sector Oversight
              </h2>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">
                Active Monitoring Feed
              </p>
            </div>
            <div className="text-[10px] font-black bg-green-500/10 text-green-600 px-4 py-2 rounded-full tracking-widest border border-green-500/20">
              {fields.length} TOTAL PLOTS
            </div>
          </div>

          <div className="p-4 md:p-10">
            {fields.length > 0 ? (
              <div className="space-y-3">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="
                      group p-5
                      bg-white dark:bg-slate-800/30
                      hover:bg-slate-50 dark:hover:bg-slate-800/60
                      rounded-3xl flex flex-col md:flex-row justify-between md:items-center
                      border border-slate-100 dark:border-white/5
                      hover:border-green-500/30
                      transition-all duration-300 cursor-pointer
                    "
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-black text-sm border border-green-500/20 shadow-inner group-hover:scale-110 transition-transform">
                        {field.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-base md:text-lg group-hover:text-green-500 transition-colors">
                          {field.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <span className="text-[10px] font-black uppercase text-green-600 tracking-wider">
                            {field.cropType}
                          </span>
                          {field.location && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <MapPin size={12} className="text-slate-300" /> {field.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                      <StageBadge stage={field.currentStage} />
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm group-hover:translate-x-1">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="opacity-20 text-slate-400" />
                </div>
                <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs">
                  Zero assignments found on the grid
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#16112b] p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:translate-y-[-4px] transition-all">
      <div className={`w-12 h-12 flex items-center justify-center ${bgColor} ${color} rounded-2xl mb-6 shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">
          {title}
        </p>
        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
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
      styles = "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      break;
    case "growing":
      styles = "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400";
      break;
    case "ready":
      styles = "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400";
      break;
    case "harvested":
      styles = "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400";
      break;
  }

  return (
    <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border border-current/10 ${styles} shrink-0`}>
      {stage}
    </span>
  );
}

const AgentSkeleton = () => (
  <div className="w-full p-8 space-y-10 animate-pulse">
    <div className="flex gap-4">
      <div className="h-14 w-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />)}
    </div>
    <div className="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-[3.5rem]" />
  </div>
);