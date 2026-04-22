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

  const stats = useMemo(() => {
    const fields: Field[] = data?.fields ?? [];
    if (fields.length === 0) return { total: 0, planted: 0, growing: 0, completed: 0 };
    
    return {
      total: fields.length,
      planted: fields.filter(f => f.currentStage.toLowerCase() === 'planted').length,
      growing: fields.filter(f => f.currentStage.toLowerCase() === 'growing').length,
      completed: fields.filter(f => 
        ['harvested', 'completed', 'ready'].includes(f.currentStage.toLowerCase())
      ).length,
    };
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-red-500 font-bold text-lg">Sync Failed</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm">
          Try Refreshing
        </button>
      </div>
    );
  }

  const dashboardData = data as DashboardData;
  if (!dashboardData) return null;

  return (
    <div className={`w-full transition-all duration-500 ${isFetching ? "opacity-60" : "opacity-100"}`}>
      
      {/* HEADER SECTION - Flush with internal padding */}
      <header className="p-4 md:p-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <LayoutDashboard className="text-green-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Admin Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Dashboard for <span className="text-green-500 font-bold">{user?.fullName ?? "System"}</span>
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="p-4 md:p-8 pt-0 space-y-6 md:space-y-10">
        
        {/* STATS GRID - Minimal gaps to use space efficiently */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <StatCard
            title="Total Fields"
            value={stats.total}
            icon={<Sprout size={24} />}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <StatCard
            title="Planted"
            value={stats.planted}
            icon={<Leaf size={24} />}
            color="text-orange-400"
            bgColor="bg-orange-400/10"
          />
          <StatCard
            title="Growing"
            value={stats.growing}
            icon={<TrendingUp size={24} />}
            color="text-indigo-500"
            bgColor="bg-indigo-500/10"
          />
          <StatCard
            title="Harvested"
            value={stats.completed}
            icon={<CheckCircle size={24} />}
            color="text-emerald-500"
            bgColor="bg-emerald-500/10"
          />
        </div>

        {/* DATA VISUALS SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* CROP DISTRIBUTION - Takes 5 cols */}
          <section className="lg:col-span-5 bg-white dark:bg-[#16112b] p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 size={20} className="text-green-500" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Crop Distribution</h2>
            </div>

            {dashboardData.topCrops.length ? (
              <div className="space-y-8">
                {dashboardData.topCrops.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-slate-600 dark:text-slate-300">{item.crop}</span>
                      <span className="text-green-500">{item.count} Plots</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(34,197,94,0.4)]" 
                        style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No current crop distribution" />
            )}
          </section>

          {/* RECENT ACTIVITY - Takes 7 cols */}
          <section className="lg:col-span-7 bg-white dark:bg-[#16112b] p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Tractor size={20} className="text-green-500" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Activity</h2>
            </div>

            <div className="space-y-4">
              {dashboardData.fields.slice(0, 5).map((field) => (
                <div
                  key={field.id}
                  className="p-4 rounded-3xl flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 hover:border-green-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-black text-sm border border-green-500/20">
                      {field.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-base group-hover:text-green-500 transition-colors">
                        {field.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">
                        {field.cropType}
                      </p>
                    </div>
                  </div>
                  <StageBadge stage={field.currentStage} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* BOTTOM INSIGHT BANNER */}
        <section className="bg-green-600 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-green-600/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">Seasonal Intelligence</h2>
              <p className="text-green-50 text-sm md:text-base opacity-90 max-w-2xl font-medium leading-relaxed">
                You are currently managing <span className="font-black text-white underline decoration-white/30 underline-offset-4">{stats.total} operational sectors</span>. All automated systems are reporting healthy crop cycles.
              </p>
            </div>
            <button className="w-fit px-10 py-4 bg-white text-green-600 font-black rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
              Export Analysis
            </button>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
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
      <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">
        {title}
      </p>
      <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
        {value ?? 0}
      </p>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let styles = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  
  if (s === 'planted') styles = "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
  if (s === 'growing') styles = "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
  if (['harvested', 'completed', 'ready'].includes(s)) styles = "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

  return (
    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${styles} shrink-0 border border-current/10`}>
      {stage}
    </span>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-20 text-center text-slate-400">
    <Search size={32} className="mx-auto mb-4 opacity-10" />
    <p className="text-sm font-bold italic tracking-wide">{message}</p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="w-full p-8 space-y-10 animate-pulse">
    <div className="flex gap-4">
      <div className="h-14 w-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />)}
    </div>
    <div className="grid grid-cols-2 gap-8">
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
    </div>
  </div>
);