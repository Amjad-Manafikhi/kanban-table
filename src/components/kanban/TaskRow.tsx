import { Task } from "@/models/database";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import React, { useState } from "react";
import UpdateText from './UpdateText';
import { useEditingContext } from "@/contexts/EditingContext";
import { GripVertical } from "lucide-react";
import { FetchState } from "@/hooks/useFetchUserTasks";
type Props = {
    id: string;
    task: Task;
    clicking: string;
    dragged:boolean;
    tasksSetState?:React.Dispatch<React.SetStateAction<FetchState<Task[]>>>;
}

 function TaskRow({id, clicking, task, dragged, tasksSetState }:Props){
    
  const { editingSpecs } = useEditingContext();
    const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
          } = useSortable({id: id}); 
          
          const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            borderLeftColor:task.color
          };

    

    const titleQueryData={
        tableName:"tasks",
        columnName:"title",
        rowId:task.task_id,
        rowIdName:"task_id",

    }
    const descriptionQueryData={
        tableName:"tasks",
        columnName:"description",
        rowId:task.task_id,
        rowIdName:"task_id",

    }

      const transparent = !dragged && clicking === task.task_id 

    return (

        <div 
            ref={setNodeRef} 
            style={!editingSpecs ? style : editingSpecs.endsWith(task.task_id) ? {} : {borderLeftColor:task.color}} 
            {...(!editingSpecs ? attributes : {})} 
            className={`  bg-white border-1 border-l-5 border-gray-400 rounded-sm w-full h-22 p-1 pl-2 ${transparent ? "opacity-0" : "opacity-100"}`}
            
            
        >
            <div className="flex h-full w-full gap-3"> 

                <div className="flex flex-col py-2 gap-1">
                    <UpdateText initialText={task.title} queryData={titleQueryData} id={`title-${task.task_id}`} tasksSetState={tasksSetState}>
                        <h3 className="text-[15px]">{task.title}</h3>    
                    </UpdateText>
                    <UpdateText initialText={task.description} queryData={descriptionQueryData} id={`description-${task.task_id}`} tasksSetState={tasksSetState} >
                        <h3 className="text-[12px]">{task.description}</h3>    
                    </UpdateText>
                    
                </div>
                <div className="flex ml-auto gap-3 pt-2">
                    <div className="w-fit h-fit p-[2px] border-1 border-gray-200 bg-gray-100 rounded-sm text-xs text-gray-600 mt-0 ml-auto ">{task.tag_name}</div>
                    <GripVertical className={`${clicking ?"cursor-grabbing":"cursor-grab"} w-4 h-4 ml-auto mr-2`} {...(!editingSpecs ? listeners : {})} />
                </div>
            </div>

        </div>
    )
}

export default (TaskRow);