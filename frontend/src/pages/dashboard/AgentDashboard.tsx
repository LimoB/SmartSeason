import { useAppSelector } from "../../app/hooks";
import { useGetAgentDashboardQuery } from "../../features/dashboard/dashboardApi";

export default function AgentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  
  // Hook is now strictly typed based on our API definition
  const { 
    data, 
    isLoading, 
    isFetching, 
    isError 
  } = useGetAgentDashboardQuery();

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-800 rounded" />
          <div className="h-4 w-40 bg-slate-800 rounded" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl border border-slate-700" />
          ))}
        </div>
        <div className="h-64 bg-slate-800 rounded-xl border border-slate-700" />
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (isError) {
    return (
      <div className="mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-400 font-medium">Unable to load your field assignments.</p>
        <p className="text-slate-500 text-sm mt-1">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-green-400 tracking-tight">
          Field Agent Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome back, <span className="text-white font-medium">{user?.fullName ?? "Agent"}</span>
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* data is now strictly typed, no 'any' needed */}
        <StatCard title="Total Assigned" value={data?.summary.total ?? 0} />
        <StatCard title="Active / Pending" value={data?.summary.pending ?? 0} />
        <StatCard title="Completed" value={data?.summary.completed ?? 0} />
      </div>

      {/* ASSIGNED FIELDS */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-green-400">
            🚜 My Assigned Fields
          </h2>
          <p className="text-xs text-slate-500 mt-1">Current monitoring tasks and field status</p>
        </div>

        <div className="p-6">
          {data?.fields && data.fields.length > 0 ? (
            <div className="space-y-3">
              {data.fields.map((field) => (
                <div
                  key={field.id}
                  className="group p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg flex justify-between items-center border border-slate-700/50 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-white group-hover:text-green-400 transition-colors">
                      {field.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                        {field.cropType}
                      </span>
                      {field.location && <span>• {field.location}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      {field.currentStage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-slate-500 italic">No fields assigned to you yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-green-500/30 transition-colors group">
      <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold group-hover:text-slate-300 transition-colors">
        {title}
      </p>
      <p className="text-3xl font-bold text-green-400 mt-2">
        {value}
      </p>
    </div>
  );
}