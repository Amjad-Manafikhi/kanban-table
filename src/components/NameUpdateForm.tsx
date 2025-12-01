import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";


// Form schema
const formSchema = z.object({
  firstName: z.string().min(1, "This field is required"),
  secondName: z.string().min(1, "This field is required"),
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
    const { firstName, secondName } = data;
    const response = await fetch("/api/auth/users/updateName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, secondName }),
    });

    const result = await response.json();
    setLoading(false);

    if (response.ok) {
      setError("");
      toast.success("Name updated successfully!");
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
          placeholder="First Name"
          className="bg-white p-2 rounded-md"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Second Name"
          className="bg-white p-2 rounded-md"
          {...register("secondName")}
        />
        {errors.secondName && (
          <p className="text-red-500 text-sm">{errors.secondName.message}</p>
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
