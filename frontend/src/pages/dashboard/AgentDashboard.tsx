import { useAppSelector } from "../../app/hooks";
import { useGetAgentDashboardQuery } from "../../features/dashboard/dashboardApi";
import { useMemo } from "react";
// Import your types here - adjust the path as necessary
// Import your types here - adjust the path as necessary
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
    // Ensuring we treat fields as the explicit Field type from your definitions
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
      <div className="mt-10 p-10 bg-white dark:bg-dark-bg border-2 border-dashed border-red-200 dark:border-dark-border rounded-3xl text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Connection Issue</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-2">
          We couldn't retrieve your assigned fields. Please check your internet.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary-500/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const fields: Field[] = data?.fields ?? [];

  return (
    <div className={`space-y-8 transition-all duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}>

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/10 rounded-2xl">
            <ClipboardList className="text-primary-500" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Agent Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back, <span className="text-primary-500 font-semibold">{user?.fullName ?? "Field Agent"}</span>
            </p>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Assigned" 
          value={stats.total} 
          icon={<ClipboardList size={20} />} 
          color="text-primary-500" 
          bgColor="bg-primary-500/10" 
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
      <div className="bg-white dark:bg-dark-bg rounded-3xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Assignments
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Field monitoring tasks for {user?.fullName ?? "Agent"}
            </p>
          </div>
          <div className="hidden sm:block text-xs font-bold bg-gray-100 dark:bg-dark-surface px-3 py-1 rounded-full text-gray-500 dark:text-gray-300">
            {fields.length} TOTAL
          </div>
        </div>

        <div className="p-6">
          {fields.length > 0 ? (
            <div className="grid gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="
                    group p-5
                    bg-gray-50 dark:bg-dark-surface/30
                    hover:bg-primary-500/5 dark:hover:bg-primary-500/10
                    rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center
                    border border-gray-200 dark:border-dark-border
                    transition-all duration-200 cursor-pointer
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center text-primary-500 shadow-sm transition-transform group-hover:scale-110">
                      <Leaf size={22} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                        {field.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-primary-500">{field.cropType}</span>
                        {/* Handling location string | null */}
                        {field.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {field.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
                    <StageBadge stage={field.currentStage} />
                    <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-flex p-4 bg-gray-50 dark:bg-dark-surface rounded-full mb-4 text-gray-300 dark:text-gray-600">
                <Search size={40} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium italic">
                No fields assigned to your profile yet.
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
    <div className="bg-white dark:bg-dark-bg p-6 rounded-3xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} ${color} rounded-2xl group-hover:rotate-6 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest">
          {title}
        </p>
        <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * Updated StageBadge to use the FieldStage type
 */
function StageBadge({ stage }: { stage: FieldStage }) {
  let styles = "bg-gray-100 text-gray-600 dark:bg-dark-surface dark:text-gray-400";
  
  switch (stage) {
    case "planted":
      styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/20";
      break;
    case "growing":
      styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/20";
      break;
    case "ready":
      styles = "bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 border border-primary-500/20";
      break;
    case "harvested":
      styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/20";
      break;
  }

  return (
    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-full transition-colors ${styles}`}>
      {stage}
    </span>
  );
}

const AgentSkeleton = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="h-12 w-64 bg-gray-200 dark:bg-dark-surface rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-dark-surface rounded-3xl" />)}
    </div>
    <div className="h-96 bg-gray-200 dark:bg-dark-surface rounded-3xl" />
  </div>
);