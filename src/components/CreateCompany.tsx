import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

// Type for decoded token payload
type SessionPayload = {
  userId: number;
  // Add more fields here if needed (like email, role, etc.)
};

// Decode function (client-side only, not secure for auth)
function decodeSessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwtDecode<SessionPayload>(token);
    return decoded;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

// Form schema
const formSchema = z.object({
  companyName: z.string().min(1, "This field is required"),
});

type FormSchemaType = z.infer<typeof formSchema>;
type Props = {
    setReFetchSidebarCompanies:Dispatch<SetStateAction<boolean>>
}
export default function CreateCOmpany({setReFetchSidebarCompanies}:Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Read token and decode userId
  useEffect(() => {
    const token = Cookies.get("session");
    if (!token) return;

    const payload = decodeSessionToken(token);
    if (payload?.userId) {
      setUserId(payload.userId.toString());
    }
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
    const { companyName } = data;
    const response = await fetch("/api/createCompany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, userId }),
    });

    const result = await response.json();
    const companyId = result.result.insertId;
    console.log("company",companyId);

    const response2 = await fetch("/api/user_company/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, userId }),
    });
    const result2 = await response2.json();

    
    setLoading(false);

    if (response.ok) {
      setError("");
      toast.success("Company created successfully!");
      setReFetchSidebarCompanies(prev => !prev);
      reset();
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
          placeholder="Company Name"
          className="bg-white p-2 rounded-md"
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm">{errors.companyName.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-gradient-to-b from-black to-gray-800 w-46 h-10 text-gray-200 rounded-md m-auto mt-4 cursor-pointer"
      >
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-white border-t-black border-b-black animate-spin m-auto" />
        ) : (
          "Create Company"
        )}
      </button>
    </form>
  );
}
