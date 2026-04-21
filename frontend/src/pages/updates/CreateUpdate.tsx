import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useCreateUpdateMutation } from "@/features/updates/updateApi";
import { ChevronLeft, Save, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

type StageType = "planted" | "growing" | "ready" | "harvested";

export default function CreateUpdate() {
  const navigate = useNavigate();
  const { selectedFieldId } = useAppSelector((state) => state.updates);
  const [createUpdate, { isLoading }] = useCreateUpdateMutation();

  const [form, setForm] = useState<{ stage: StageType; notes: string }>({
    stage: "planted",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFieldId) {
      toast.error("No field selected. Please go back and select a field.");
      return;
    }

    try {
      await createUpdate({
        fieldId: selectedFieldId,
        stage: form.stage,
        notes: form.notes,
      }).unwrap();

      toast.success("Update log saved successfully");
      navigate("/updates"); // Redirect back to list
    } catch {
      toast.error("Failed to save update");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 dark:hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Updates
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Update Log</h1>
          <p className="text-slate-500 mt-1">Logging progress for Field ID: <span className="text-green-600 font-bold">#{selectedFieldId}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Select Current Stage
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["planted", "growing", "ready", "harvested"] as StageType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, stage: s })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                    form.stage === s 
                      ? "border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                      : "border-slate-100 dark:border-slate-800 text-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Activity Notes
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe soil conditions, weather, or observations..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500/50 text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>

          {!selectedFieldId && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <p className="text-xs font-bold">Warning: No field ID linked to this session.</p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedFieldId}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/30 disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? "Saving..." : <><Save size={20} /> Save Update</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}