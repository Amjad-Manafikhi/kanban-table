import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
    idx:number | undefined;
    refetch:() => Promise<unknown>;
    setOpen:React.Dispatch<React.SetStateAction<boolean>>;  
    company_id?:number; 
}

export default function ColumnForm({idx, refetch, setOpen, company_id}:Props){

    const [ loading, setLoading ] = useState(false);

    const formSchema = z
    .object({
        typeName: z.string().min(1," This field is required"),
    })
    
    type FormSchemaType = z.infer<typeof formSchema>;
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });



    async function onSubmit (data: FormSchemaType) {
        
        setLoading(true);
        const { typeName } = data
        const length=idx ? idx+1 : 1;
        
        const response = await fetch('/api/task_types/create', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ typeName, idx:length, company_id:company_id }),
        });
        setLoading(false);
        if (response.ok) {
            toast.success('Type Added Successfully!')
            refetch();
        } else {
            toast.error("Something Went Wrong");

        }
        setOpen(false);
    };
    
    return(

        <div className='w-full h-full flex flex-col items-center'>
            <form 
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col w-[400px] bg-gray-200 rounded-md px-6 py-8 gap-4 "
            >
                <div className='flex flex-col'>
                    <input
                    type="typeName"
                    placeholder="Type Name"
                    className="bg-white p-2 rounded-md"
                    {...register('typeName')}
                    />
                    {errors.typeName && (
                        <p className="text-red-500 text-sm">{errors.typeName.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-gradient-to-b from-black to-gray-800 w-26 h-10 text-gray-200 rounded-md m-auto mt-4 cursor-pointer"
                    >
                    {loading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-black border-b-black animate-spin m-auto" />
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>

        </div>

    )
}