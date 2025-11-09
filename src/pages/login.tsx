import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from "zod"
import toast  from 'react-hot-toast';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';


    export const getServerSideProps: GetServerSideProps = async (context) => {
        const isLoggedIn = context.req.cookies.loggedIn === 'true'; 
        
        if (isLoggedIn) {
            return {
            redirect: {
                destination: '/login', 
                permanent: false, 
            },
            };
        }

        return {
            props: {}, 
        };
    };




export default function LoginPage() {
    

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const router=useRouter();
    
    const formSchema = z
      .object({
        email: z.string().email(),
        password: z.string().min(8, 'Password should be at least 8 characters'),
      })
      
      
    
    type FormSchemaType = z.infer<typeof formSchema>;


    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormSchemaType>({
      resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: FormSchemaType) => {
      setLoading(true);
      const {email, password}=data;
      const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      const result= await response.json();
      setLoading(false);
      if (response.ok) {
        setError("");
        setLoggedIn(true);
        toast.success('Logged in Successfully!')
        router.push("/")
      } else {
          setError(result.error || "Somthing Went Wrong")
          toast.error(result.error);
      }
    };
 
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
        <Link href={"/"} className='fixed top-4 left-4'>&larr; back to home</Link>
        <form
        noValidate={true}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[400px] bg-gray-200 rounded-md px-6 py-8 gap-4"
      >
        <div className="flex justify-between">
          <h1 className="">Task Management System</h1>
        </div>
        <div className='flex flex-col'>
            <input
            type="email"
            placeholder="Email"
            className="bg-white p-2 rounded-md"
            {...register('email')}
            
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div className='flex flex-col'>

            <input
            type="password"
            placeholder="Password"
            className="bg-white p-2 rounded-md"
            {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className='text-[12px] text-gray-500'>Don&apos;t have an account ? <Link className="underline text-[#0000EE]" href="/signup">Create Account</Link></p>
        <button
          disabled={loggedIn}
          type="submit"
          className="bg-gradient-to-b from-black to-gray-800 w-26 h-10 text-gray-200 rounded-md m-auto mt-4 cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-black border-b-black animate-spin m-auto" />
          ) : (
            'Log in'
          )}
        </button>
        </form>
    </div>
  )
}

LoginPage.noLayout = true;