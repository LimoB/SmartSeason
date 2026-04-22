import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFieldMutation } from "@/features/fields/fieldApi";
import { useAppSelector } from "@/app/hooks";
import { ArrowLeft } from "lucide-react";
import type { AdminCreateFieldRequest } from "@/features/fields/fieldApi";
import { toast } from "react-toastify";

/* ================= FORM STATE ================= */
type FormState = {
  name: string;
  cropType: string;
  location: string;
  plantingDate: string;
  expectedHarvestDate: string;
};

/* ================= API ERROR TYPE ================= */
type ApiError = {
  data?: {
    message?: string;
  };
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export default function CreateField() {
  const navigate = useNavigate();
  const [createField, { isLoading }] = useCreateFieldMutation();

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState<FormState>({
    name: "",
    cropType: "",
    location: "",
    plantingDate: "",
    expectedHarvestDate: "",
  });

  /* ================= PROTECT ROUTE ================= */
  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Access denied. Only admins can create fields.
      </div>
    );
  }

  /* ================= CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= VALIDATION ================= */
  const isValid =
    form.name.trim() &&
    form.cropType.trim() &&
    form.plantingDate;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload: AdminCreateFieldRequest = {
        name: form.name.trim(),
        cropType: form.cropType.trim(),
        location: form.location.trim() || undefined,

        plantingDate: new Date(form.plantingDate).toISOString(),

        expectedHarvestDate: form.expectedHarvestDate
          ? new Date(form.expectedHarvestDate).toISOString()
          : undefined,

        // optional for admin
        assignedAgentId: null,
      };

      await createField(payload).unwrap();

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

      <h1 className="text-2xl font-bold text-green-600">
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
          required
        />

        <Input
          name="cropType"
          label="Crop Type"
          value={form.cropType}
          onChange={handleChange}
          required
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
          required
        />

        <Input
          name="expectedHarvestDate"
          label="Expected Harvest"
          type="date"
          value={form.expectedHarvestDate}
          onChange={handleChange}
        />

        <button
          disabled={isLoading || !isValid}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Field"}
        </button>
      </form>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({ label, required, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        {...props}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}