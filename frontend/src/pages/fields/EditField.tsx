import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Loader2, Wheat } from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetFieldByIdQuery,
  useUpdateFieldMutation,
} from "../../features/fields/fieldApi";

import type { Field } from "../../types/types";

/* ================= TYPES ================= */
type ApiError = {
  data?: {
    message?: string;
  };
};

interface EditFieldFormProps {
  field: Field;
  isUpdating: boolean;
  onUpdate: ReturnType<typeof useUpdateFieldMutation>[0];
}

/* ================= MAIN COMPONENT ================= */
export default function EditField() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fieldId = id ? Number(id) : null;

  const {
    data: field,
    isLoading: fieldLoading,
    isError,
  } = useGetFieldByIdQuery(fieldId as number, {
    skip: fieldId === null,
  });

  const [updateField, { isLoading: isUpdating }] = useUpdateFieldMutation();

  if (fieldLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Retrieving Sector Data...</p>
      </div>
    );
  }

  if (isError || !field) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <p className="text-red-500 font-bold mb-4">Error: Field not found.</p>
        <button
          onClick={() => navigate("/fields")}
          className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm"
        >
          Return to Fields
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8 pb-20">
      {/* NAVIGATION */}
      <div className="px-3 md:px-0">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-green-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-green-600 group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          Cancel Editing
        </button>
      </div>

      <div className="mx-3 md:mx-0 bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-4">
          <div className="p-3 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-600/20">
            <Wheat size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Edit Field Details
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Modify operational parameters for <span className="text-green-600 font-bold">{field.name}</span>
            </p>
          </div>
        </div>

        <EditFieldForm
          field={field}
          isUpdating={isUpdating}
          onUpdate={updateField}
        />
      </div>
    </div>
  );
}

/* ================= INNER FORM COMPONENT ================= */
function EditFieldForm({
  field,
  isUpdating,
  onUpdate,
}: EditFieldFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: field.name || "",
    cropType: field.cropType || "",
    location: field.location || "",
    plantingDate: field.plantingDate ? field.plantingDate.split("T")[0] : "",
    expectedHarvestDate: field.expectedHarvestDate ? field.expectedHarvestDate.split("T")[0] : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: field.id,
        name: formData.name,
        cropType: formData.cropType,
        location: formData.location || undefined,
        plantingDate: formData.plantingDate || undefined,
        expectedHarvestDate: formData.expectedHarvestDate || undefined,
      };

      await onUpdate(payload).unwrap();
      toast.success("Sector updated successfully");
      navigate(`/fields/${field.id}`);
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Failed to update sector");
    }
  };

  const inputStyles = "w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500/50 focus:border-green-600 rounded-xl outline-none transition-all text-sm font-semibold text-slate-900 dark:text-white";
  const labelStyles = "text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1";

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="md:col-span-2 space-y-2">
          <label className={labelStyles}>Field Identification Name</label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., North Sector A-1"
            className={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <label className={labelStyles}>Primary Crop Type</label>
          <input
            required
            type="text"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            placeholder="e.g., Maize, Wheat"
            className={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <label className={labelStyles}>Geographic Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Eldoret North"
            className={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <label className={labelStyles}>Planting Date</label>
          <input
            type="date"
            name="plantingDate"
            value={formData.plantingDate}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>

        <div className="space-y-2">
          <label className={labelStyles}>Expected Harvest</label>
          <input
            type="date"
            name="expectedHarvestDate"
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>

      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          disabled={isUpdating}
          className="flex-[2] py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-xs"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isUpdating ? "Saving Sector Data..." : "Commit Changes"}
        </button>
      </div>
    </form>
  );
}