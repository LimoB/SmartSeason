import { useAppSelector } from "../../app/hooks";
import { useGetAdminDashboardQuery } from "../../features/dashboard/dashboardApi";
import { useMemo } from "react";

// Lucide Icons
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  CheckCircle,
  Leaf,
  Tractor,
  BarChart3,
  AlertCircle,
  Search,
} from "lucide-react";

/* ================= TYPES ================= */
interface Field {
  id: number;
  name: string;
  cropType: string;
  currentStage: string;
}

interface DashboardData {
  summary: {
    total: number;
    planted: number;
    growing: number;
    completed: number;
  };
  topCrops: Array<{ crop: string; count: number }>;
  fields: Field[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, isFetching, isError } =
    useGetAdminDashboardQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  /* ================= CLIENT-SIDE STATS CALCULATION ================= */
  const stats = useMemo(() => {
    const fields: Field[] = data?.fields ?? [];
    if (fields.length === 0) return { total: 0, planted: 0, growing: 0, completed: 0 };
    
    return {
      total: fields.length,
      planted: fields.filter(f => f.currentStage.toLowerCase() === 'planted').length,
      growing: fields.filter(f => f.currentStage.toLowerCase() === 'growing').length,
      completed: fields.filter(f => 
        f.currentStage.toLowerCase() === 'harvested' || 
        f.currentStage.toLowerCase() === 'completed' ||
        f.currentStage.toLowerCase() === 'ready'
      ).length,
    };
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-red-500 font-bold text-lg">Sync Failed</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  const dashboardData = data as DashboardData;
  if (!dashboardData) return null;

  return (
    // Removed "px" and "max-w" to sit flush against the sidebar
    <div className={`w-full space-y-4 md:space-y-8 pb-10 transition-all duration-500 ${isFetching ? "opacity-60" : "opacity-100"}`}>
      
      {/* HEADER - Minimal horizontal padding only for small screens */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-3 md:px-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-600/10 rounded-xl">
            <LayoutDashboard className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Admin Overview
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dashboard for <span className="text-green-600 font-bold">{user?.fullName?.split(' ')[0] ?? "Admin"}</span>
            </p>
          </div>
        </div>
      </header>

      {/* STATS GRID - "Flush" on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-3 md:px-0">
        <StatCard
          title="Total Fields"
          value={stats.total}
          icon={<Sprout size={20} />}
          color="text-green-600"
          bgColor="bg-green-600/10"
        />
        <StatCard
          title="Planted"
          value={stats.planted}
          icon={<Leaf size={20} />}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          title="Growing"
          value={stats.growing}
          icon={<TrendingUp size={20} />}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          title="Harvested"
          value={stats.completed}
          icon={<CheckCircle size={20} />}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
      </div>

      {/* SECTIONS - Flush layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-8 px-3 md:px-0">
        {/* TOP CROPS */}
        <section className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={18} className="text-green-600" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Crop Distribution</h2>
          </div>

          {dashboardData.topCrops.length ? (
            <div className="space-y-5">
              {dashboardData.topCrops.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5 text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{item.crop}</span>
                    <span className="text-green-600">{item.count} Plots</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No crop data" />
          )}
        </section>

        {/* RECENT ACTIVITY */}
        <section className="lg:col-span-3 bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Tractor size={18} className="text-green-600" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Recent Activity</h2>
          </div>

          <div className="space-y-3">
            {dashboardData.fields.slice(0, 5).map((field) => (
              <div
                key={field.id}
                className="p-3.5 rounded-2xl flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-green-600 font-black text-xs">
                    {field.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{field.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.cropType}</p>
                  </div>
                </div>
                <StageBadge stage={field.currentStage} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SYSTEM INSIGHT - Full width banner */}
      <div className="px-3 md:px-0">
        <section className="bg-green-600 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-2">Performance Insight</h2>
              <p className="text-green-50 text-sm opacity-90 max-w-xl font-medium">
                Monitoring <span className="font-black text-white">{stats.total} active fields</span>. Seasonal consistency is currently at <span className="font-black text-white">94%</span>.
              </p>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-white text-green-600 font-black rounded-xl text-sm active:scale-95 transition-transform">
              Full Report
            </button>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </section>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className={`w-10 h-10 flex items-center justify-center ${bgColor} ${color} rounded-xl mb-4`}>
        {icon}
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        {value ?? 0}
      </p>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let styles = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  
  if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (s === 'growing') styles = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (s === 'harvested' || s === 'completed' || s === 'ready') styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

  return (
    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-full ${styles} shrink-0`}>
      {stage}
    </span>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-10 text-center text-slate-400">
    <Search size={24} className="mx-auto mb-2 opacity-20" />
    <p className="text-xs font-bold italic">{message}</p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse px-3 md:px-0">
    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />)}
    </div>
    <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
  </div>
);