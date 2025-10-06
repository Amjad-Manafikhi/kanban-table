import React, { useEffect, useState } from 'react';
import {useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';

import {
  SortableContext,
} from "@dnd-kit/sortable";
import UpdateText, { TextLoading } from "./UpdateText"
import { Task, Task_types } from "@/models/database";
import TaskRow from './TaskRow';
import { useEditingContext } from '@/contexts/EditingContext';
import {  GripVertical } from "lucide-react";

type Props = {
    dragged:boolean;
    column:Task_types;
    columnTasks:Task[];
    clicking: string;
    reFetch:() => Promise<unknown>;
}

 function Column ({column, columnTasks, clicking, dragged}:Props){


    const [items, setItems] = useState<{id:string}[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const { editingSpecs }=useEditingContext();
    const [nameLoading, setNameLoading] = useState<TextLoading>({loading:"false",textValue:""});

    const nameQueryData={
      tableName:"task_types",
      columnName:"type_name",
      rowId:column.type_id,
      rowIdName:"type_id",

    }

    useEffect(() => {
        if (columnTasks) {
          setItems(columnTasks.map((task) => ({id:task.task_id})));
          setTasks(columnTasks);
        }
      }, [columnTasks]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({id: column.type_id}); 
      
      const style = {
        transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
        transition,
      };
      
      const transparent = !dragged && clicking=== column.type_id 
    

    return(
        <div 
          ref={setNodeRef} 
          style={!editingSpecs ? style : undefined} 
          {...(!editingSpecs ? attributes : {})} 
          
          className={` w-[270px] p-2 rounded-md ${transparent ? "opacity-0" : "opacity-100"}`}>
            <div className='flex flex-col gap-4'>

                <div className='flex gap-2'>
                  <UpdateText initialText={column.type_name} queryData={nameQueryData} setLoading={setNameLoading}>
                    <h1 className='font-bold -ml-1'>{nameLoading.loading === "false" ? column.type_name : nameLoading.textValue}</h1>
                  </UpdateText>
                  <p className='text-gray-500 '>({tasks.length})</p>
                  <GripVertical className={`${clicking===column.type_id?"cursor-grabbing":"cursor-grab"} w-5 h-5 ml-auto`} {...(!editingSpecs ? listeners : {})} />
                </div>

                <div className='flex flex-col'>
                    
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-wrap gap-5">
                            {tasks.map((task) => (
                                <TaskRow dragged={false} key={task.task_id} clicking={clicking}  id={task.task_id} task={task} />
                            ))}
                            </div>
                        </SortableContext>
                    
                </div>
            </div>

        </div>
    )

}

     
export default React.memo(Column);