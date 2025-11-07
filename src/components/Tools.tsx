import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "./Modal";
import TaskForm from './TaskForm';
import TagForm from './TagForm';
import { Task_types } from "@/models/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ColumnForm from "./ColumnForm";

type Props={
    taskTypes:Task_types[] | null;
    typeIdMap:Record<string, number>
    reFetch:() => Promise<unknown>;
}

export default function Tools({taskTypes, typeIdMap, reFetch}:Props){
   
    const router =useRouter();
    const { tag }=router.query;
    const [tagParams, setTagParams] = useState(tag || "All Tags")
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [openTypeModal, setOpenTypeModal] = useState(false);
    const [openTagModal, setOpenTagModal] = useState(false);
    
    
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
            <DropdownMenu>
            <DropdownMenuTrigger 
                className="bg-blue-500 cursor-pointer rounded-md p-1 px-3 text-white w-fit"
            >Add New</DropdownMenuTrigger>
            <DropdownMenuContent>
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem><button onClick={()=>setOpenTaskModal(true )} className="w-full h-full flex items-first">Task</button></DropdownMenuItem>
                <DropdownMenuItem><button onClick={()=>setOpenTypeModal(true )} className="w-full h-full flex items-first">Task Type</button></DropdownMenuItem>
                <DropdownMenuItem><button onClick={()=>setOpenTagModal(true )} className="w-full h-full flex items-first">Task Tag</button></DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            <Modal open={openTaskModal} setOpen={setOpenTaskModal} title={"Add New Task"}>
                <TaskForm taskTypes={taskTypes} typeIdMap={typeIdMap}/>
            </Modal>
            <Modal open={openTypeModal} setOpen={setOpenTypeModal} title={"Add New Type"} >
                <ColumnForm idx={taskTypes?.length} refetch={reFetch} setOpen={setOpenTypeModal}/>
            </Modal>
            <Modal open={openTagModal} setOpen={setOpenTagModal} title={"Add New Tag"}>
                <TagForm />
            </Modal>
        </div>

    )
}