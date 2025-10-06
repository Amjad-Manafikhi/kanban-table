import { FormEvent, useState } from 'react';
import { useRouter } from "next/router";
import {toast} from "react-hot-toast"
import { Task_types } from '@/models/database';


type Props={
    taskTypes:Task_types[] | null;
    typeIdMap:Record<string, number>;
}
const NEXT_PUBLIC_API_URL=process.env.NEXT_PUBLIC_API_URL;    


export default function Form( {taskTypes, typeIdMap}:Props){
    const [ formValues, setFormValues ] = useState({title:"",description:"",type_id:taskTypes? taskTypes[0]?.type_id : ""});
    const router = useRouter();
      
      
      function handleChange(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
          const {name, value}=e.target;
          setFormValues(
              prev => (
                  {
              ...prev,
               [name]:value
            }
        )
    )
      }

      console.log("qwer",typeIdMap)
      async function handleSubmit(e:  FormEvent<HTMLFormElement>){
          e.preventDefault();
          
          
          try {
              const res = await fetch(NEXT_PUBLIC_API_URL+'/api/tasks/create', {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                newTask:{
                    ...formValues,
                    type_id:formValues.type_id,
                    idx:typeIdMap[formValues.type_id]+1 || 1,
                }
                }),
            });

            const data = await res.json();
            
            if (res.ok) {
                router.reload();
            toast.success('Submited Successfully!')
            console.log('created:', data);
            // Optionally refresh state or re-fetch patients here
            } else {
                toast.error(`Error Creating task`)
                console.error('create task failed:', data.message);
            }
        } catch (error) {
            console.error(`Error creating task:`, error);
        }
        
        // setFormValues(intialFormValues);
        
    }
    

    const options = taskTypes?.map((type) => {
        return(
            <option key={type.type_id} value={type.type_id} > {type.type_name}</option>
        )
    })

    
    return(
        <>
        <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col  p-5 w-[60%] max-w-[500px] m-auto border rounded-md" action="">
              
            <label className="mt-2" htmlFor={"title"}>Title</label>
            <input 
                type="text" 
                name="title" 
                value={formValues.title} 
                onChange={handleChange}  
                className="border w-full h-8 rounded-md text-sm px-3"
            />

            <label className="mt-2" htmlFor="description">Description</label>
            <input 
                type="text" 
                name="description" 
                value={formValues.description} 
                onChange={handleChange}  
                className="border w-full h-8 rounded-md text-sm px-3"
            />

            

            <select
                name="type_id" 
                defaultValue={formValues.type_id} onChange={handleChange}
                className="border-2 p-1 mt-6 rounded-md"
            >
                {options}
            </select>


              <button
                className=" mt-4 m-auto bg-blue-500 rounded-md px-4 py-2 text-sm font-bold items-center justify-center text-white cursor-pointer "
                type="submit">Submit</button>
            </form>
        </>
    ) 

}
