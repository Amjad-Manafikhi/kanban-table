import { Task } from "@/models/database";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import React, { useState } from "react";
import UpdateText from './UpdateText';
import { useEditingContext } from "@/contexts/EditingContext";
import {TextLoading} from "./UpdateText"
import { GripVertical } from "lucide-react";
type Props = {
    id: string;
    task: Task;
    clicking: string;
    dragged:boolean;
}

 function TaskRow({id, clicking, task, dragged}:Props){
    
  const { editingSpecs } = useEditingContext();
  const [titleLoading, setTitleLoading] = useState<TextLoading>({loading:"false",textValue:""});
  const [descriptionLoading, setDescriptionLoading] = useState<TextLoading>({loading:"false",textValue:""});
  
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
            style={!editingSpecs ? style : undefined} 
            {...(!editingSpecs ? attributes : {})} 
            className={`  bg-white border-1 border-gray-400 rounded-md w-full h-22 p-1 ${transparent ? "opacity-0" : "opacity-100"}`}
            
        >
            <div className="flex h-full w-full gap-3"> 
                <div className="h-full border-2 rounded-full border-blue-400"></div>

                <div className="flex flex-col py-2 gap-1">
                    <UpdateText initialText={task.title} queryData={titleQueryData} setLoading={setTitleLoading}>
                        <h3 className="text-[15px]">{titleLoading.loading === "false" ? task.title : titleLoading.textValue}</h3>    
                    </UpdateText>
                    <UpdateText initialText={task.description} queryData={descriptionQueryData} setLoading={setDescriptionLoading}>
                        <p className="text-[12px] text-gray-600 cursor-pointer">{descriptionLoading.loading === "false"? task.description : descriptionLoading.textValue}</p>    
                    </UpdateText>
                    
                </div>
                  <GripVertical className={`${clicking===task.task_id?"cursor-grabbing":"cursor-grab"} w-4 h-4 ml-auto mt-2 mr-2`} {...(!editingSpecs ? listeners : {})} />
            </div>

        </div>
    )
}

export default React.memo(TaskRow);