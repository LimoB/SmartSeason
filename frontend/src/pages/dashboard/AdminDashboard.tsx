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
        f.currentStage.toLowerCase() === 'completed'
      ).length,
    };
  }, [data]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 p-8 border-2 border-dashed border-red-200 dark:border-dark-border rounded-3xl">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-red-500 font-medium">
          Failed to load dashboard data.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-primary-500/10 rounded-xl transition-colors text-sm font-semibold dark:text-gray-300"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  const dashboardData = data as DashboardData;
  if (!dashboardData) return null;

  return (
    <div className={`space-y-8 transition-all duration-500 ${isFetching ? "opacity-60" : "opacity-100"}`}>
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/10 rounded-2xl">
            <LayoutDashboard className="text-primary-500" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Overview for <span className="text-primary-500 font-semibold">{user?.fullName ?? "Administrator"}</span>
            </p>
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-dark-surface px-4 py-2 rounded-full w-fit border border-gray-200 dark:border-dark-border">
          SmartSeason Analytics
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fields"
          value={stats.total}
          icon={<Sprout size={20} />}
          color="text-primary-500"
          bgColor="bg-primary-500/10"
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

      <div className="grid lg:grid-cols-5 gap-8">
        {/* TOP CROPS */}
        <section className="lg:col-span-2 bg-white dark:bg-dark-bg p-6 rounded-3xl border border-gray-200 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Crops</h2>
            </div>
          </div>

          {dashboardData.topCrops.length ? (
            <div className="space-y-4">
              {dashboardData.topCrops.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span className="text-gray-700 dark:text-gray-300">{item.crop}</span>
                    <span className="text-primary-500">{item.count} Fields</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${(item.count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No crop data available" />
          )}
        </section>

        {/* RECENT FIELDS */}
        <section className="lg:col-span-3 bg-white dark:bg-dark-bg p-6 rounded-3xl border border-gray-200 dark:border-dark-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Tractor size={20} className="text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Fields</h2>
            </div>
          </div>

          {dashboardData.fields.length ? (
            <div className="grid gap-4">
              {dashboardData.fields.slice(0, 5).map((field) => (
                <div
                  key={field.id}
                  className="
                    p-4 rounded-2xl flex justify-between items-center
                    bg-gray-50 dark:bg-dark-surface/30
                    hover:bg-primary-500/5 dark:hover:bg-primary-500/10
                    border border-gray-200 dark:border-dark-border
                    transition-all duration-200 group cursor-pointer
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center text-primary-500 font-bold shadow-sm group-hover:scale-110 transition-transform">
                      {field.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                        {field.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {field.cropType}
                      </p>
                    </div>
                  </div>

                  <StageBadge stage={field.currentStage} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No fields available" />
          )}
        </section>
      </div>

      {/* SYSTEM INSIGHT */}
      <section className="bg-primary-500 p-8 rounded-3xl shadow-xl shadow-primary-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp size={24} />
              SmartSeason Insight
            </h2>
            <p className="text-white/90 max-w-xl">
              Tracking <span className="font-bold underline decoration-2 underline-offset-4">{stats.total} active fields</span>. 
              The system is performing optimally across all assigned regions.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-primary-500 font-bold rounded-xl hover:bg-gray-50 transition-colors shrink-0 shadow-lg">
            View Analytics
          </button>
        </div>
        {/* Decorative Circles using Primary Theme */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full" />
      </section>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-dark-bg p-6 rounded-3xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
          {title}
        </p>
        <p className="text-4xl font-black text-gray-900 dark:text-white mt-1">
          {value ?? 0}
        </p>
      </div>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const s = stage.toLowerCase();
  let styles = "bg-gray-100 text-gray-600 dark:bg-dark-surface dark:text-gray-400";
  
  if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/20";
  if (s === 'growing') styles = "bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 border border-primary-500/20";
  if (s === 'harvested' || s === 'completed') styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/20";

  return (
    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-full ${styles}`}>
      {stage}
    </span>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-12 flex flex-col items-center justify-center text-gray-400">
    <Search size={40} className="mb-2 opacity-20" />
    <p className="text-sm italic">{message}</p>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="h-12 w-64 bg-gray-200 dark:bg-dark-surface rounded-2xl" />
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-dark-surface rounded-3xl" />)}
    </div>
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-2 h-64 bg-gray-200 dark:bg-dark-surface rounded-3xl" />
      <div className="col-span-3 h-64 bg-gray-200 dark:bg-dark-surface rounded-3xl" />
    </div>
  </div>
);