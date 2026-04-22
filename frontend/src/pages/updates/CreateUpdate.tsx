import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useCreateUpdateMutation } from "@/features/updates/updateApi";
import { useGetFieldsQuery } from "@/features/fields/fieldApi"; 
import { 
  ChevronLeft, 
  Save, 
  Loader2, 
  Wheat, 
  MapPin, 
  CheckCircle2 
} from "lucide-react";
import { toast } from "react-toastify";

type StageType = "planted" | "growing" | "ready" | "harvested";

export default function CreateUpdate() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const reduxSelectedId = useAppSelector((state) => state.updates.selectedFieldId);

  // Local state to handle field selection within this form
  const [activeFieldId, setActiveFieldId] = useState<number | null>(reduxSelectedId || null);
  const [form, setForm] = useState<{ stage: StageType; notes: string }>({
    stage: "planted",
    notes: "",
  });

  // Fetch all fields to let the agent choose
  const { data: allFields, isLoading: isFieldsLoading } = useGetFieldsQuery();
  
  // Filter fields to only show those assigned to THIS agent
  const myFields = allFields?.filter(f => f.assignedAgentId === user?.id) || [];
  
  // Find details for the currently selected field
  const selectedField = myFields.find(f => f.id === activeFieldId);

  const [createUpdate, { isLoading: isSaving }] = useCreateUpdateMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFieldId) {
      toast.error("Please select a field first.");
      return;
    }
    try {
      await createUpdate({
        fieldId: activeFieldId,
        stage: form.stage,
        notes: form.notes,
      }).unwrap();
      toast.success("Update log saved successfully");
      navigate("/updates");
    } catch {
      toast.error("Failed to save update");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 dark:hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Updates
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Wheat size={20} className="text-green-600" />
             </div>
             <h1 className="text-2xl font-black text-slate-900 dark:text-white">Field Activity Log</h1>
          </div>
          <p className="text-slate-500 text-sm">Submit real-time progress for assigned farms.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* STEP 1: SELECT FIELD */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              1. Which farm are you updating?
            </label>
            
            {isFieldsLoading ? (
              <div className="flex items-center gap-2 p-4 text-slate-400"><Loader2 className="animate-spin" size={18}/> Loading your fields...</div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {myFields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setActiveFieldId(field.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      activeFieldId === field.id 
                      ? "border-green-600 bg-green-50/50 dark:bg-green-900/10" 
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <MapPin size={18} className={activeFieldId === field.id ? "text-green-600" : "text-slate-400"} />
                      <div>
                        <p className={`font-bold text-sm ${activeFieldId === field.id ? "text-green-700 dark:text-green-400" : ""}`}>
                          {field.name}
                        </p>
                        <p className="text-xs text-slate-500">{field.cropType}</p>
                      </div>
                    </div>
                    {activeFieldId === field.id && <CheckCircle2 size={18} className="text-green-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2: STAGE SELECTION */}
          <div className={`space-y-3 transition-opacity ${!activeFieldId ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              2. Current Growth Stage
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["planted", "growing", "ready", "harvested"] as StageType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, stage: s })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                    form.stage === s 
                      ? "border-green-600 bg-green-600 text-white shadow-md" 
                      : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: NOTES */}
          <div className={`space-y-3 transition-opacity ${!activeFieldId ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              3. Observations & Notes
            </label>
            <textarea
              required
              rows={4}
              placeholder={selectedField ? `How is the ${selectedField.cropType} doing today?` : "Select a field first..."}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-green-500/50 text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !activeFieldId}
              className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:bg-slate-300 transition-all active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><Save size={20} /> Submit Log</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}