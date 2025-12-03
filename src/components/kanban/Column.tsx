import React, { useEffect, useState } from 'react';
import { useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

import {
  SortableContext,
} from "@dnd-kit/sortable";
import UpdateText from "./UpdateText"
import { Task, Task_types } from "@/types/database";
import TaskRow from './TaskRow';
import { useEditingContext } from '@/contexts/EditingContext';
import { GripVertical } from "lucide-react";
import { FetchState } from '@/hooks/useFetchUserTasks';

type Props = {
  dragged: boolean;
  column: Task_types;
  columnTasks: Task[];
  clicking: string;
  reFetch: () => Promise<unknown>;
  tasksSetState?: React.Dispatch<React.SetStateAction<FetchState<Task[]>>>
  setState?: React.Dispatch<React.SetStateAction<FetchState<Task_types[]>>>
}

function Column({ column, columnTasks, clicking, dragged, setState, tasksSetState }: Props) {


  const [items, setItems] = useState<{ id: string }[]>([]);
  // const [tasks, setTasks] = useState<Task[]>([]);
  const { editingSpecs } = useEditingContext();

  const nameQueryData = {
    tableName: "task_types",
    columnName: "type_name",
    rowId: column.type_id,
    rowIdName: "type_id",

  }

  useEffect(() => {
    if (columnTasks) {
      setItems(columnTasks.map((task) => ({ id: task.task_id })));
    }
  }, [columnTasks]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.type_id });
  const height = columnTasks?.length * 110 + 40
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    height: `${height}px`,
  };

  const transparent = !dragged && clicking === column.type_id

  return (
    <div
      ref={setNodeRef}
      style={!editingSpecs ? style : { height: `${height}px` }}
      {...(!editingSpecs ? attributes : {})}

      className={` w-[270px] p-3 rounded-md bg-gray-200  pb-[80px] ${transparent ? "opacity-0" : "opacity-100"}`}>
      <div className='flex flex-col gap-4'>

        <div className='flex gap-2'>
          <UpdateText key={column.type_id} initialText={column.type_name} queryData={nameQueryData} id={`name-${column.type_id}`} setState={setState}>
            <h1 className='font-bold -ml-1'>{column.type_name}</h1>
          </UpdateText>
          <p className='text-gray-500 '>({columnTasks?.length})</p>
          <GripVertical className={`${clicking ? "cursor-grabbing" : "cursor-grab"} w-5 h-5 ml-auto`} {...(!editingSpecs ? listeners : {})} />
        </div>

        <div className='flex flex-col'>

          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="flex flex-wrap gap-5">
              {columnTasks.map((task) => (
                <TaskRow dragged={false} key={task.task_id} clicking={clicking} id={task.task_id} task={task} tasksSetState={tasksSetState} />
              ))}
            </div>
          </SortableContext>

        </div>
      </div>

    </div>
  )

}


export default (Column);