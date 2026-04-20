import { useAppSelector } from "../../app/hooks";
import { useGetAdminDashboardQuery } from "../../features/dashboard/dashboardApi";

// Lucide Icons
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  CheckCircle,
  Leaf,
  Tractor,
  BarChart3,
} from "lucide-react";

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

  const { data, isLoading, isFetching, isError } =
    useGetAdminDashboardQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800 rounded" />

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700"
            />
          ))}
        </div>

        <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl mt-6" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-red-500 dark:text-red-400">
          Failed to load dashboard data.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-gray-500 dark:text-slate-400 underline"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  const dashboardData = data as DashboardData;
  if (!dashboardData) return null;

  return (
    <div
      className={`space-y-8 transition-opacity ${
        isFetching ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="text-green-500" size={26} />
        <div>
          <h1 className="text-3xl font-bold text-green-500">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Welcome back,{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              {user?.fullName ?? "Admin"}
            </span>
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          title="Total Fields"
          value={dashboardData.summary.total}
          icon={<Sprout size={18} />}
        />
        <StatCard
          title="Planted"
          value={dashboardData.summary.planted}
          icon={<Leaf size={18} />}
        />
        <StatCard
          title="Growing"
          value={dashboardData.summary.growing}
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          title="Harvested"
          value={dashboardData.summary.completed}
          icon={<CheckCircle size={18} />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* TOP CROPS */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-green-500" />
            <h2 className="text-lg font-semibold text-green-500">
              Top Crops
            </h2>
          </div>

          {dashboardData.topCrops.length ? (
            <ul className="space-y-3">
              {dashboardData.topCrops.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between text-gray-700 dark:text-slate-300 border-b border-gray-200 dark:border-slate-800 pb-2"
                >
                  <span>{item.crop}</span>
                  <span className="text-green-500 font-semibold">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-slate-400">
              No crop data available
            </p>
          )}
        </section>

        {/* RECENT FIELDS */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Tractor size={18} className="text-green-500" />
            <h2 className="text-lg font-semibold text-green-500">
              Recent Fields
            </h2>
          </div>

          {dashboardData.fields.length ? (
            <div className="space-y-3">
              {dashboardData.fields.slice(0, 5).map((field) => (
                <div
                  key={field.id}
                  className="
                    p-4 rounded-lg flex justify-between items-center
                    bg-gray-50 dark:bg-slate-800/50
                    hover:bg-gray-100 dark:hover:bg-slate-800
                    border border-gray-200 dark:border-slate-700/50
                    transition cursor-pointer
                  "
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {field.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {field.cropType}
                    </p>
                  </div>

                  <span className="
                    px-3 py-1 text-xs rounded-full
                    bg-green-500/10 text-green-600 dark:text-green-400
                    border border-green-500/20
                  ">
                    {field.currentStage}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-slate-400">
              No fields available
            </p>
          )}
        </section>
      </div>

      {/* INSIGHTS */}
      <section className="
        bg-gradient-to-r from-green-500/10 to-gray-100 dark:to-slate-900
        p-6 rounded-xl border border-green-500/20
      ">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={18} className="text-green-500" />
          <h2 className="text-lg font-semibold text-green-500">
            System Insight
          </h2>
        </div>

        <p className="text-gray-700 dark:text-slate-300">
          Tracking{" "}
          <span className="text-gray-900 dark:text-white font-semibold">
            {dashboardData.summary.total}
          </span>{" "}
          fields. Growth performance is stable.
        </p>
      </section>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="
      bg-white dark:bg-slate-900
      p-4 rounded-xl
      border border-gray-200 dark:border-slate-800
      hover:border-green-500/40
      transition shadow-sm
    ">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider font-medium">
          {title}
        </p>
        <div className="text-green-500">{icon}</div>
      </div>

      <p className="text-2xl font-bold text-green-500 mt-2">
        {value ?? 0}
      </p>
    </div>
  );
}