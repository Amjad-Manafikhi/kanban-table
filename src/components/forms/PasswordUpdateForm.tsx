import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";


// Form schema
const formSchema = z
  .object({
    oldPassword: z.string().min(8, 'Password should be at least 8 characters'),
    newPassword: z.string().min(8, 'Password should be at least 8 characters'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword    , {
    message: 'Passwords must match',
    path: ['confirmNewPassword'],
  });

type FormSchemaType = z.infer<typeof formSchema>;

export default function NameUpdateForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    const oldPassword  = data.oldPassword;
    const nonHashedNewPassword  = data.newPassword;
    const saltRounds=10;
    const newPassword= await bcrypt.hash(nonHashedNewPassword,saltRounds);
    const response = await fetch("/api/auth/users/updatePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setError("");
      toast.success("Password updated successfully!");
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
          type="password"
          placeholder="Old Password"
          className="bg-white p-2 rounded-md"
          {...register("oldPassword")}
        />
        {errors.oldPassword && (
          <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <input
          type="password"
          placeholder="New Password"
          className="bg-white p-2 rounded-md"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <input
          type="password"
          placeholder="Confirm New Password"
          className="bg-white p-2 rounded-md"
          {...register("confirmNewPassword")}
        />
        {errors.confirmNewPassword && (
          <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-gradient-to-b from-black to-gray-800 w-46 h-10 text-gray-200 rounded-md m-auto mt-4 cursor-pointer"
      >
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-white border-t-black border-b-black animate-spin m-auto" />
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
