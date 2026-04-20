import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useCreateUpdateMutation,
  useGetFieldUpdatesQuery,
} from "@/features/updates/updateApi";

import {
  openUpdateModal,
  closeUpdateModal,
  setStageFilter,
} from "@/features/updates/updateSlice";

import { toast } from "react-toastify";

/* ================= TYPES ================= */
type StageType = "planted" | "growing" | "ready" | "harvested";

export default function Updates() {
  const dispatch = useAppDispatch();

  const { selectedFieldId, isModalOpen, stageFilter } = useAppSelector(
    (state) => state.updates
  );

  const [createUpdate, { isLoading }] = useCreateUpdateMutation();

  const { data: updates = [], refetch } = useGetFieldUpdatesQuery(
    selectedFieldId as number,
    {
      skip: !selectedFieldId,
    }
  );

  const [form, setForm] = useState<{
    stage: StageType;
    notes: string;
  }>({
    stage: "planted",
    notes: "",
  });

  /* ================= CREATE UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFieldId) {
      toast.error("Please select a field first");
      return;
    }

    try {
      await createUpdate({
        fieldId: selectedFieldId,
        stage: form.stage,
        notes: form.notes,
      }).unwrap();

      toast.success("Update created successfully");

      setForm({ stage: "planted", notes: "" });
      dispatch(closeUpdateModal());
      refetch();
    } catch {
      toast.error("Failed to create update");
    }
  };

  /* ================= FILTER ================= */
  const filteredUpdates =
    stageFilter === "all"
      ? updates
      : updates.filter((u) => u.stage === stageFilter);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Field Updates
        </h1>

        <div className="flex gap-2">

          <select
            value={stageFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              dispatch(
                setStageFilter(e.target.value as "all" | StageType)
              )
            }
            className="px-3 py-2 rounded-lg border bg-white dark:bg-dark-surface"
          >
            <option value="all">All</option>
            <option value="planted">Planted</option>
            <option value="growing">Growing</option>
            <option value="ready">Ready</option>
            <option value="harvested">Harvested</option>
          </select>

          <button
            onClick={() => dispatch(openUpdateModal())}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg"
          >
            New Update
          </button>

        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="grid gap-4">

        {filteredUpdates.length === 0 && (
          <p className="text-gray-500">No updates found</p>
        )}

        {filteredUpdates.map((u) => (
          <div
            key={u.id}
            className="p-4 rounded-xl border bg-white dark:bg-dark-surface"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                Field #{u.fieldId}
              </h3>

              <span className="text-sm text-primary-500">
                {u.stage}
              </span>
            </div>

            <p className="text-gray-500 mt-2">{u.notes}</p>
          </div>
        ))}

      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Create Field Update
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <select
                value={form.stage}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setForm({
                    ...form,
                    stage: e.target.value as StageType,
                  })
                }
                className="w-full p-3 border rounded-lg"
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </select>

              <textarea
                placeholder="Notes..."
                value={form.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => dispatch(closeUpdateModal())}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}