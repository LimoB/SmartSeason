import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFieldMutation } from "@/features/fields/fieldApi";
import { ArrowLeft } from "lucide-react";
import type { CreateFieldRequest } from "@/features/fields/fieldApi";

import { toast } from "react-toastify";

/* ================= FORM STATE ================= */
type FormState = Omit<CreateFieldRequest, "assignedAgentId">;

/* ================= API ERROR TYPE ================= */
type ApiError = {
  data?: {
    message?: string;
  };
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function CreateField() {
  const navigate = useNavigate();
  const [createField, { isLoading }] = useCreateFieldMutation();

  const [form, setForm] = useState<FormState>({
    name: "",
    cropType: "",
    location: "",
    plantingDate: "",
    expectedHarvestDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createField({
        name: form.name,
        cropType: form.cropType,
        location: form.location,

        // SAFE DATE HANDLING
        plantingDate: new Date(form.plantingDate).toISOString(),

        expectedHarvestDate: form.expectedHarvestDate
          ? new Date(form.expectedHarvestDate).toISOString()
          : null,

        assignedAgentId: null,
      }).unwrap();

      toast.success("Field created successfully");
      navigate("/fields");
    } catch (err: unknown) {
      const error = err as ApiError;

      const message =
        error?.data?.message ?? "Failed to create field";

      toast.error(message);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-green-500">
        Create Field
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800"
      >
        <Input
          name="name"
          label="Field Name"
          value={form.name}
          onChange={handleChange}
        />

        <Input
          name="cropType"
          label="Crop Type"
          value={form.cropType}
          onChange={handleChange}
        />

        <Input
          name="location"
          label="Location"
          value={form.location}
          onChange={handleChange}
        />

        <Input
          name="plantingDate"
          label="Planting Date"
          type="date"
          value={form.plantingDate}
          onChange={handleChange}
        />

        <Input
          name="expectedHarvestDate"
          label="Expected Harvest"
          type="date"
          value={form.expectedHarvestDate}
          onChange={handleChange}
        />

        <button
          disabled={isLoading}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Field"}
        </button>
      </form>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 dark:text-slate-400">
        {label}
      </label>

      <input
        {...props}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      />
    </div>
  );
}