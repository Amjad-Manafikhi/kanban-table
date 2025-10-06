import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  CollisionDetection,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Column from "./../components/Column";
import { Task, Task_types } from "@/models/database";
import { FetchState } from "@/hooks/useFetchUserTasks";
import Layout from "@/components/Layout";
import Tools from '../components/Tools';
import DeleteArea from './../components/DeleteArea';
import { EditingProvider, useEditingContext } from "@/contexts/EditingContext";
import TaskRow from "./TaskRow";
import { createPortal } from "react-dom";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Reorder = {
    id:string;
}
type FetchedData<T> = {
    reFetch: () => Promise<unknown>;
    setState: React.Dispatch<React.SetStateAction<FetchState<T>>>;
    data: T | null;
    loading: boolean;
    error: unknown | null;
}

type Props={
    userTasks:FetchedData<Task[]>;
    userTaskTypes:FetchedData<Task_types[]>;
    updateColumns:(newcolumns: {id:string}[]) => Promise<void>;
    updateRows:(newItems: {id:string}[], overColumnId:string, activeTaskId:string) => Promise<void>;
    deleteColumn:(id:string) => Promise<void>;
    deleteRow:(id:string) => Promise<void>;


}
export default function KanbanTable({userTasks, userTaskTypes, updateColumns, updateRows, deleteColumn, deleteRow}:Props) {

    const collisionDetection: CollisionDetection = (args) => {
        const intersections = rectIntersection(args);

        // If trash is intersected, prioritize it
        console.log(intersections);
        const trashHit = intersections.find((i) => i.id === "trash");
        if (trashHit) return [trashHit];
        
        return intersections;
    };


  
  const {data:taskTypes, error, loading, reFetch, setState} = userTaskTypes;
  const {data:tasks, error:tasksError, loading:tasksLoading, reFetch:tasksReFetch, setState:tasksSetState} = userTasks;
  const [columns, setColumns] = useState<Reorder[]>([]);
  const [rows, setRows] = useState<Reorder[]>([]);
  const [clicking, setClicking] = useState("");
  const [DraggedElement, setDraggedElement] = useState<Task| Task_types| null>(null);
  const  {editingSpecs} = useEditingContext(); //change this to context 
  useEffect(() => {
      if (taskTypes) {
          setColumns(taskTypes.map((type) => ({id:type.type_id})));
    }
  }, [taskTypes]);

  useEffect(() => {
    if (tasks) {
      setRows(tasks.map((task) => ({id:task.task_id})));
    }
  }, [tasks]);
  


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

    function countTypeIds(tasks:Task[] | null) {
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return {};
        }

        // Use the reduce method to iterate over the array and build the map (the accumulator)
        const typeIdCountMap = tasks.reduce((accumulator, currentObject) => {
            // 1. Get the type_id from the current object
            const id = currentObject.type_id;

            // Ensure the object actually has a type_id
            if (id) {
                // 2. Check if the type_id is already a key in the accumulator map.
                //    If it exists, increment the count; otherwise, start the count at 1.
                accumulator[id] = (accumulator[id] || 0) + 1;
            }

            // 3. Return the updated accumulator for the next iteration
            return accumulator;
        }, {} as Record<string, number>); // Start with an empty object as the initial accumulator (the map)

        return typeIdCountMap;
        }

        const typeIdMap = countTypeIds(tasks);
        console.log("qwert",typeIdMap);

  
  if (loading) return <p>Loading...</p>;


  return (
      
      <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      
      >
        
        <Tools taskTypes={taskTypes} typeIdMap={typeIdMap}/>
        <div className="w-full h-full bg-red pt-6">
            <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                <div className="flex flex-wrap gap-8">
                {taskTypes !== null ? taskTypes.map((item) => (
                    <Column dragged={false} key={item.type_name} clicking={clicking} column={item} reFetch={tasksReFetch} columnTasks={tasks!==null ? tasks?.filter(task => task.type_id===item.type_id) : []} /> 
                )) :null }
                </div>
            </SortableContext>
        </div>
        <DragOverlay>
            {
                DraggedElement &&
                ("task_id" in DraggedElement ? (
                <TaskRow
                    key={DraggedElement.task_id}
                    clicking={clicking}
                    id={DraggedElement.task_id}
                    task={DraggedElement}
                    dragged={true}
                />
                ) : "type_id" in DraggedElement ? (
                <Column
                    key={DraggedElement.type_name}
                    clicking={clicking}
                    column={DraggedElement}
                    reFetch={tasksReFetch}
                    columnTasks={
                    tasks
                        ? tasks.filter(
                            (task) => task.type_id === DraggedElement.type_id
                        )
                        : []
                    }
                    dragged={true}

                />
                ) : null)
            }
        </DragOverlay>
        <DeleteArea isDragging={clicking.length > 0 ? true : false }/>
    
    </DndContext>
  );
    async function handleDragStart(event:DragStartEvent){
        if(editingSpecs)return;
        
        const { active } = event;
        const id=active.id;
        if( typeof(id)==='string' && id[0]==='c'){
            const col = taskTypes?.find((t) => t.type_id === id) ?? null;
            setDraggedElement(col);
        }
        else {
            const task = tasks?.find((t) => t.task_id === id) ?? null;
            setDraggedElement(task);
        }
        setClicking(active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        if(editingSpecs)return;
        const { active, over } = event;
        if (!over) return;
        
        setDraggedElement(null);
        setClicking("");
        if(over.id === "trash"){
            if(typeof(active.id) === "string" && active.id[0]==='c'){
                
                await deleteColumn(active.id as string)
                reFetch();
            }
            else{
                
                
                await deleteRow(active.id as string);
                tasksReFetch();
            }
        }
    
        
        else if (active.id !== over.id) {
            if(typeof(active.id) === "string" && active.id[0]==='c' ){
                const oldIndex = columns.findIndex((i) => i.id === active.id);
                const newIndex = columns.findIndex((i) => i.id === over.id);

                const newColumns = arrayMove(columns, oldIndex, newIndex);
                setColumns(newColumns);

                if(taskTypes!=null) setState((prev) => ( {...prev, data:arrayMove(taskTypes, oldIndex, newIndex)}));

                await updateColumns(newColumns); 

                reFetch();
            }
            else{
                const oldIndex = rows.findIndex((i) => i.id === active.id);
                const newIndex = rows.findIndex((i) => i.id === over.id);
                const newColumn = String(over.id)[0]==='t' ? tasks?.find((item) => item.task_id === over.id)?.type_id ?? undefined : over.id;;
                const newRows = arrayMove(rows, oldIndex, newIndex);
                setRows(newRows);
                if(tasks!=null) tasksSetState((prev) => ( {...prev, data:arrayMove(tasks, oldIndex, newIndex)}));
                await updateRows(newRows,String(newColumn), String(active.id)); 

                tasksReFetch();
            }
        }
    
    }

function handleDragOver(event :DragOverEvent){
    if(editingSpecs)return;
    const { active, over} = event;
    console.log("test2",over?.id);
    if (!over) return;
    
    if (typeof(over.id)==="string" && over.id[0]==='c'){
     tasksSetState((prevState: FetchState<Task[]>) => {
        if (!prevState.data) return prevState; // nothing to update
        updateRows([{id:String(active.id)}],String(over.id),String(active.id));
        return {
          ...prevState,
          data: prevState.data.map((row: Task) =>
            active?.id === row.task_id ? { ...row, type_id: String(over.id),idx:typeIdMap[over.id] || 0 } : row
          ),
        };
      });
    }
  }
} 