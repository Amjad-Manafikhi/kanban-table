import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "./Modal";
import TaskForm from './TaskForm';
import { Task_types } from "@/models/database";

type Props={
    taskTypes:Task_types[] | null;
    typeIdMap:Record<string, number>
}

export default function Tools({taskTypes, typeIdMap}:Props){
   
    const router =useRouter();
    const { tag }=router.query;
    const [tagParams, setTagParams] = useState(tag || "All Tags")
    const [openModal, setOpenModal] = useState(false);
    
    
    function changeTag(event: React.ChangeEvent<HTMLSelectElement>) {    
        const tag = event.target.value;
        router.push({
            query:{tag:tag}
        })
        setTagParams(tag);
    }
    
    




    return(
        <div className="w-full mt-10 flex items-center justify-center gap-8">

            <form className="">
                <select 
                    name="Price" 
                    defaultValue={tagParams} onChange={changeTag}
                    className="border-2 p-1 rounded-md"
                >
                    
                    <option value="all" >All Tags</option>
                    <option value="front">Front </option>
                    <option value="back">Back </option>
                </select>
            </form>
            <button onClick={()=>setOpenModal(true )} className="bg-blue-500 cursor-pointer rounded-md p-1 px-3 text-white w-fit">New Task</button>
            <Modal open={openModal} setOpen={setOpenModal} title={"Add New Task"}>
                <TaskForm taskTypes={taskTypes} typeIdMap={typeIdMap}/>
            </Modal>
        </div>

    )
}