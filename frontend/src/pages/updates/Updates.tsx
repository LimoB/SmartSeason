import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetFieldUpdatesQuery } from "@/features/updates/updateApi";
import { useGetFieldsQuery } from "@/features/fields/fieldApi";
import { setStageFilter, setSelectedField } from "@/features/updates/updateSlice";
import { 
  Plus, 
  Calendar, 
  ClipboardList, 
  ChevronRight, 
  MapPin,
  Clock,
  LayoutGrid
} from "lucide-react";

import type { FieldStage, Field } from "@/types/types";

/* ================= TYPES ================= */
type FilterStageType = FieldStage | "all";

// Define the interface to avoid 'any'
interface FieldUpdate {
  id: number;
  fieldId: number;
  agentId: number;
  stage: FieldStage;
  notes: string;
  createdAt: string;
}

// Interface for when the API might wrap the array in an object
interface UpdatesApiResponse {
  updates?: FieldUpdate[];
  data?: FieldUpdate[];
}

export default function Updates() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux State
  const { selectedFieldId, stageFilter } = useAppSelector((state) => state.updates);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  
  const isAdmin = currentUser?.role === "admin";

  // API Queries
  const { data: fieldsData, isLoading: fieldsLoading } = useGetFieldsQuery();
  
  // 1. Available Fields Logic
  const availableFields = useMemo(() => {
    const allFields = (fieldsData as Field[]) || [];
    if (isAdmin) return allFields;
    return allFields.filter(f => f.assignedAgentId === currentUser?.id);
  }, [fieldsData, isAdmin, currentUser]);

  // 2. Updates Query
  const {
    data: updatesData,
    isLoading: updatesLoading,
    isFetching,
  } = useGetFieldUpdatesQuery(selectedFieldId as number, {
    skip: !selectedFieldId,
  });

  const selectedField = useMemo(() => {
    return availableFields.find((f) => f.id === selectedFieldId);
  }, [availableFields, selectedFieldId]);

  // 3. Filter Logic (Type-Safe)
  const filteredUpdates = useMemo(() => {
    let rawUpdates: FieldUpdate[] = [];

    if (Array.isArray(updatesData)) {
      rawUpdates = updatesData as FieldUpdate[];
    } else if (updatesData) {
      const response = updatesData as UpdatesApiResponse;
      rawUpdates = response.updates || response.data || [];
    }

    if (stageFilter === "all") return rawUpdates;

    // Use toLowerCase() for both sides to prevent casing mismatches
    return rawUpdates.filter((u) => 
      u.stage?.toLowerCase() === stageFilter?.toLowerCase()
    );
  }, [updatesData, stageFilter]);

  /* ================= RENDER: SELECTION MODE ================= */
  if (!selectedFieldId) {
    return (
      <div className="space-y-8 pb-20">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Field Selection
            </h1>
            <p className="text-slate-500 mt-2">
              {isAdmin 
                ? "Select any sector to view administrative logs." 
                : "Select one of your assigned farms to view history."}
            </p>
          </div>
          <button
            onClick={() => navigate("/updates/create")}
            className="hidden md:flex items-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg shadow-green-600/20 transition-all active:scale-95 font-bold"
          >
            <Plus size={20} />
            Create New Log
          </button>
        </header>

        {fieldsLoading ? (
          <UpdatesSkeleton />
        ) : availableFields.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <MapPin className="mx-auto text-slate-300 mb-4" size={48} />
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Fields Assigned</h3>
             <p className="text-slate-500">You don't have any fields assigned to your account yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableFields.map((field) => (
              <button
                key={field.id}
                onClick={() => dispatch(setSelectedField(field.id))}
                className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-500/10 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <LayoutGrid size={24} />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase rounded-lg">
                    {field.cropType}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{field.name}</h3>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {field.location || "Regional Zone"}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ================= RENDER: UPDATES VIEW ================= */
  return (
    <div className="space-y-8 min-h-screen pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <button 
            onClick={() => dispatch(setSelectedField(null))}
            className="text-green-600 text-[10px] font-black uppercase tracking-widest mb-2 hover:underline flex items-center gap-1"
          >
            ← Change Selection
          </button>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {selectedField?.name || "Field"} Logs
          </h1>
          <p className="text-slate-500 mt-1">
            {isAdmin ? "Full historical oversight" : "Your activity logs for this field"}
          </p>
        </div>

        <button
          onClick={() => navigate("/updates/create")}
          className="flex items-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg shadow-green-600/20 transition-all active:scale-95 font-bold"
        >
          <Plus size={20} />
          Add Update
        </button>
      </header>

      {/* FILTER BAR */}
      <section className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-2">
        {(["all", "planted", "growing", "ready", "harvested"] as const).map((stage) => (
          <button
            key={stage}
            onClick={() => dispatch(setStageFilter(stage as FilterStageType))}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${
              stageFilter === stage
                ? "bg-green-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {stage}
          </button>
        ))}
      </section>

      {/* CONTENT */}
      {updatesLoading || isFetching ? (
        <UpdatesSkeleton />
      ) : filteredUpdates.length === 0 ? (
        <EmptyUpdates />
      ) : (
        <div className="grid gap-6">
          {filteredUpdates.map((update) => (
            <div
              key={update.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-6">
                  <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                    <Calendar size={24} className="text-green-600 mb-1" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">LOG</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <StageBadge stage={update.stage} />
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock size={14} />
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                      {update.stage} Stage Log
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl italic">
                      "{update.notes || "No observations recorded."}"
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button 
                    onClick={() => navigate(`/updates/${update.id}`)}
                    className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StageBadge({ stage }: { stage: string }) {
  const s = stage?.toLowerCase();
  let styles = "bg-slate-100 text-slate-600";
  if (s === 'planted') styles = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
  if (s === 'growing') styles = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
  if (s === 'ready' || s === 'harvested') styles = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";

  return (
    <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${styles}`}>
      {stage}
    </span>
  );
}

function EmptyUpdates() {
  return (
    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800">
      <div className="inline-flex p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-6 text-slate-300">
        <ClipboardList size={48} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Logs Found</h3>
      <p className="text-slate-500 max-w-xs mx-auto mt-2">Try changing your filter or adding a new update for this field.</p>
    </div>
  );
}

function UpdatesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
      ))}
    </div>
  );
}