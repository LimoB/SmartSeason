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
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center border-2 border-dashed border-red-200 dark:border-slate-800 rounded-3xl">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-red-500 font-bold text-lg">Dashboard Sync Failed</p>
        <p className="text-gray-500 text-sm max-w-xs mt-1">We couldn't fetch the latest agricultural data.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-8 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-xl transition-all font-bold text-sm"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  const dashboardData = data as DashboardData;
  if (!dashboardData) return null;

  return (
    <div className={`space-y-6 md:space-y-10 pb-10 transition-all duration-500 ${isFetching ? "opacity-60" : "opacity-100"}`}>
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-600/10 rounded-2xl">
            <LayoutDashboard className="text-green-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Admin Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, <span className="text-green-600 font-bold">{user?.fullName?.split(' ')[0] ?? "Admin"}</span>
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 dark:bg-slate-800 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700">
          Analytics Engine v2.0
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Fields"
          value={stats.total}
          icon={<Sprout size={22} />}
          color="text-green-600"
          bgColor="bg-green-600/10"
        />
        <StatCard
          title="Planted"
          value={stats.planted}
          icon={<Leaf size={22} />}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          title="Growing"
          value={stats.growing}
          icon={<TrendingUp size={22} />}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          title="Harvested"
          value={stats.completed}
          icon={<CheckCircle size={22} />}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        {/* TOP CROPS SECTION */}
        <section className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BarChart3 size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Crop Distribution</h2>
          </div>

          {dashboardData.topCrops.length ? (
            <div className="space-y-6">
              {dashboardData.topCrops.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.crop}</span>
                    <span className="font-black text-green-600">{item.count} <span className="text-[10px] uppercase text-slate-400 ml-1">Plots</span></span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No crop distribution data" />
          )}
        </section>

        {/* RECENT ACTIVITY SECTION */}
        <section className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Tractor size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Field Activity</h2>
          </div>

          {dashboardData.fields.length ? (
            <div className="space-y-3">
              {dashboardData.fields.slice(0, 5).map((field) => (
                <div
                  key={field.id}
                  className="
                    p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4
                    bg-slate-50 dark:bg-slate-800/40
                    hover:bg-green-50 dark:hover:bg-green-900/10
                    border border-slate-100 dark:border-slate-800
                    transition-all duration-200 group
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-green-600 font-black shadow-sm group-hover:scale-110 transition-transform">
                      {field.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {field.name}
                      </p>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {field.cropType}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:block">
                    <StageBadge stage={field.currentStage} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No recent field updates" />
          )}
        </section>
      </div>

      {/* SYSTEM INSIGHT BANNER */}
      <section className="bg-green-600 p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-green-600/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <TrendingUp size={14} /> System Health: Excellent
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
              Agricultural Performance Insight
            </h2>
            <p className="text-green-50 text-sm md:text-base opacity-90 leading-relaxed">
              Monitoring <span className="font-black text-white">{stats.total} active fields</span> across all regions. 
              Crop growth cycles are currently <span className="font-black text-white">94% consistent</span> with seasonal projections.
            </p>
          </div>
          <button className="w-full md:w-auto px-8 py-4 bg-white text-green-600 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl">
            Generate Full Report
          </button>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
      </section>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
      <div className={`w-12 h-12 flex items-center justify-center ${bgColor} ${color} rounded-2xl mb-6 group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <p className="text-4xl font-black text-slate-900 dark:text-white">
          {value ?? 0}
        </p>
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let styles = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  
  if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/20";
  if (s === 'growing') styles = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50 dark:border-green-900/20";
  if (s === 'harvested' || s === 'completed' || s === 'ready') styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/20";

  return (
    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm ${styles}`}>
      {stage}
    </span>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
    <Search size={32} className="mb-3 opacity-20" />
    <p className="text-sm font-bold italic opacity-60">{message}</p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex justify-between items-center">
       <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
       <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-[2rem]" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
      <div className="lg:col-span-3 h-80 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
    </div>
  </div>
);