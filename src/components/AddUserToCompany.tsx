import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Company } from "@/models/database";

const formSchema = z.object({
  userEmail: z.string().email(),
  companyId: z.number().min(1, "Please select a company"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateCompany() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function setData() {
      setLoading(true);
      try {
        const data = await getCompanies();
        if (data) setCompanies(data);
      } finally {
        setLoading(false);
      }
    }
    setData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    const response = await fetch("/api/addUserToCompany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setError("");
      toast.success("User added successfully!");
      reset({ userEmail: "", companyId: 0 });
    } else {
      setError(result.error || "Something went wrong");
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full bg-gray-200 rounded-md px-3 py-4 gap-4"
    >
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="User Email"
          className="bg-white p-2 rounded-md"
          {...register("userEmail")}
        />
        {errors.userEmail && (
          <p className="text-red-500 text-sm">{errors.userEmail.message}</p>
        )}
      </div>

      <select
        {...register("companyId", { valueAsNumber: true })}
        className="border-2 rounded-md bg-white p-2"
      >
        <option value={0} disabled>Select company</option>
        {companies.map((company) => (
          <option key={company.company_id} value={company.company_id}>
            {company.name}
          </option>
        ))}
      </select>
      {errors.companyId && (
        <p className="text-red-500 text-sm">{errors.companyId.message}</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-gradient-to-b from-black to-gray-800 w-46 h-10 text-gray-200 rounded-md m-auto mt-4 cursor-pointer"
      >
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-white border-t-black border-b-black animate-spin m-auto" />
        ) : (
          "Add User"
        )}
      </button>
    </form>
  );
}

async function getCompanies(): Promise<Company[] | undefined> {
  try {
    const res = await fetch("/api/readOwnerCompany");
    if (!res.ok) throw new Error("Failed to fetch companies");
    return res.json();
  } catch (error) {
    console.error("Error reading companies:", error);
  }
}
