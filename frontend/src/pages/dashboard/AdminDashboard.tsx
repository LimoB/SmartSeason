import { useAppSelector } from "../../app/hooks";
import { useGetAdminDashboardQuery } from "../../features/dashboard/dashboardApi";

// 1. Define the interface for your data structure
interface DashboardData {
  summary: {
    total: number;
    planted: number;
    growing: number;
    completed: number;
  };
  topCrops: Array<{ crop: string; count: number }>;
  fields: Array<{
    id: number;
    name: string;
    cropType: string;
    currentStage: string;
  }>;
}

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  // 2. RTK Query handles the initial fetch automatically. 
  // Added 'refetchOnMountOrArgChange' if you REALLY want fresh data on every visit.
  const {
    data,
    isLoading,
    isFetching, // Helpful for showing a small spinner when updating in the background
    isError,
  } = useGetAdminDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true, 
  });

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-slate-800 rounded" />
        <div className="h-4 w-1/2 bg-slate-800 rounded" />
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl border border-slate-700" />
          ))}
        </div>
        <div className="h-40 bg-slate-800 rounded-xl mt-6" />
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-red-400">Failed to load dashboard data.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-sm text-slate-400 underline"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  // Cast the data or update the API definition to return DashboardData
  const dashboardData = data as DashboardData;

  if (!dashboardData) return null;

  return (
    <div className={`space-y-8 transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
      
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold text-green-400">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back, <span className="text-white font-medium">{user?.fullName ?? "Admin"}</span>
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Fields" value={dashboardData.summary.total} />
        <StatCard title="Planted" value={dashboardData.summary.planted} />
        <StatCard title="Growing" value={dashboardData.summary.growing} />
        <StatCard title="Harvested" value={dashboardData.summary.completed} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ================= TOP CROPS ================= */}
        <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-lg font-semibold text-green-400 mb-4">🌾 Top Crops</h2>
          {dashboardData.topCrops.length ? (
            <ul className="space-y-3">
              {dashboardData.topCrops.map((item, i) => (
                <li key={i} className="flex justify-between text-slate-300 border-b border-slate-800 pb-2">
                  <span>{item.crop}</span>
                  <span className="text-green-400 font-semibold">{item.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No crop data available</p>
          )}
        </section>

        {/* ================= RECENT FIELDS ================= */}
        <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-lg font-semibold text-green-400 mb-4">🚜 Recent Fields</h2>
          {dashboardData.fields.length ? (
            <div className="space-y-3">
              {dashboardData.fields.slice(0, 5).map((field) => (
                <div key={field.id} className="p-4 bg-slate-800 rounded-lg flex justify-between items-center hover:bg-slate-700 transition cursor-pointer">
                  <div>
                    <p className="font-medium text-white">{field.name}</p>
                    <p className="text-xs text-slate-400">{field.cropType}</p>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                    {field.currentStage}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No fields available</p>
          )}
        </section>
      </div>

      {/* ================= INSIGHTS ================= */}
      <section className="bg-gradient-to-r from-green-500/10 to-slate-900 p-6 rounded-xl border border-green-500/20">
        <h2 className="text-lg font-semibold text-green-400 mb-2">📊 System Insight</h2>
        <p className="text-slate-300">
          Tracking <span className="text-white font-semibold">{dashboardData.summary.total}</span> fields. 
          Growth performance is stable.
        </p>
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-green-500/50 transition shadow-sm">
      <p className="text-slate-400 text-sm uppercase tracking-wider font-medium">{title}</p>
      <p className="text-2xl font-bold text-green-400">{value ?? 0}</p>
    </div>
  );
}