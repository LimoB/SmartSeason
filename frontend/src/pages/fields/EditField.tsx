import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Loader2, Wheat } from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetFieldByIdQuery,
  useUpdateFieldMutation,
} from "@/features/fields/fieldApi";

import type { Field } from "@/types/types";

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
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading field data...</p>
      </div>
    );
  }

  if (isError || !field) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-red-500 font-bold">Error: Field not found.</p>
        <button
          onClick={() => navigate("/fields")}
          className="text-green-600 hover:underline"
        >
          Return to Fields
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-600 transition-colors"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Cancel & Back
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Wheat className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Edit Field
            </h1>
            <p className="text-sm text-slate-500">
              Update crop details and growth stages
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
    plantingDate: field.plantingDate
      ? field.plantingDate.split("T")[0]
      : "",
    expectedHarvestDate: field.expectedHarvestDate
      ? field.expectedHarvestDate.split("T")[0]
      : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

//   /* ================= SAFE DATE HANDLER ================= */
//   const safeDate = (value: string | null | undefined) => {
//     if (!value) return null;
//     const date = new Date(value);
//     return isNaN(date.getTime()) ? null : date;
//   };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      id: field.id,
      name: formData.name,
      cropType: formData.cropType,
      location: formData.location,

      // FIX: send STRING not Date
      plantingDate: formData.plantingDate || null,
      expectedHarvestDate: formData.expectedHarvestDate || null,
    };

    console.log("Submitting field update payload:", payload);

    await onUpdate(payload).unwrap();

    toast.success("Field updated successfully!");
    navigate(`/fields/${field.id}`);
  } catch (err: unknown) {
    const error = err as ApiError;

    console.error("Update error:", err);

    toast.error(error?.data?.message || "Failed to update field");
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="md:col-span-2 space-y-2">
          <label>Field Name</label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label>Crop Type</label>
          <input
            required
            type="text"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label>Planting Date</label>
          <input
            type="date"
            name="plantingDate"
            value={formData.plantingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label>Expected Harvest</label>
          <input
            type="date"
            name="expectedHarvestDate"
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl disabled:opacity-50"
        >
          {isUpdating ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}