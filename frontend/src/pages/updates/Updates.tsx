import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetFieldUpdatesQuery } from "@/features/updates/updateApi";
import { setStageFilter } from "@/features/updates/updateSlice";
import { Plus, Filter, Calendar, ClipboardList } from "lucide-react";
import type { FieldStage } from "@/types/types";

/* ================= TYPES ================= */
type FilterStageType = FieldStage | "all";

export default function Updates() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedFieldId, stageFilter } = useAppSelector((state) => state.updates);

  /* ================= SAFE QUERY ================= */
  const {
    data: updates = [],
    isLoading,
  } = useGetFieldUpdatesQuery(selectedFieldId ?? 0, {
    skip: !selectedFieldId,
  });

  /* ================= FILTER LOGIC ================= */
  const filteredUpdates =
    stageFilter === "all"
      ? updates
      : updates.filter((u) => u.stage === stageFilter);

  /* ================= HANDLERS ================= */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStageFilter(e.target.value as FilterStageType));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Field Updates</h1>
          <p className="text-slate-500 text-sm">
            Monitoring progress for Field <span className="font-bold text-green-600">#{selectedFieldId || "N/A"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={stageFilter}
              onChange={handleFilterChange}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>

          <button
            onClick={() => navigate("/updates/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-transform"
          >
            <Plus size={20} />
            New Update
          </button>
        </div>
      </header>

      {/* LIST */}
      {isLoading ? (
        <div className="p-10 text-center animate-pulse text-slate-400 font-medium">
          Loading updates...
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <ClipboardList size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No updates found</h3>
          <p className="text-slate-500 text-sm">Try changing your filter or add a new log.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUpdates.map((u) => (
            <div
              key={u.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Current Stage
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white capitalize">
                      {u.stage}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500">
                  REF: #{u.id}
                </div>
              </div>
              <div className="md:pl-14">
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                  "{u.notes || "No additional notes provided for this update."}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}