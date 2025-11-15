import React, { useState, useEffect, useMemo } from "react";
import {
    DndContext,
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
import Tools from '../components/Tools';
import DeleteArea from './../components/DeleteArea';
import { useEditingContext } from "@/contexts/EditingContext";
import TaskRow from "./TaskRow";
import { useSocket } from "../hooks/useSocket";
import LiveMouseBoard from "./LiveMouseBoard";
import { useRouter } from "next/router";
import ColumnSkeleton from "./ColumnSkeleton";

export type Reorder = {
    id: string;
}
export type RowsReorder = Record<string, Reorder[]>
type FetchedData<T> = {
    reFetch: () => Promise<unknown>;
    setState: React.Dispatch<React.SetStateAction<FetchState<T>>>;
    data: T | null;
    loading: boolean;
    error: unknown | null;
}

type Props = {
    userTasks: FetchedData<Task[]>;
    userTaskTypes: FetchedData<Task_types[]>;
    updateColumns: (newcolumns: Reorder[], activeId: string, overId: string) => Promise<void>;
    updateRows: (newItems: Reorder[], overColumnId: string, activeTaskId: string) => Promise<void>;
    deleteColumn: (id: string) => Promise<void>;
    deleteRow: (id: string) => Promise<void>;
    company_id?:number;


}
export default function KanbanTable({ userTasks, userTaskTypes, updateColumns, updateRows, deleteColumn, deleteRow, company_id }: Props) {

    const collisionDetection: CollisionDetection = (args) => {
        const intersections = rectIntersection(args);

        // If trash is intersected, prioritize it
        const trashHit = intersections.find((i) => i.id === "trash");
        if (trashHit) return [trashHit];

        return intersections;
    };


    const router=useRouter();
    const {socket,socketId} = useSocket();
    const { data: taskTypes, loading, reFetch, setState } = userTaskTypes;
    const { data: tasks, loading:tasksLoading, reFetch: tasksReFetch, setState: tasksSetState } = userTasks;
    const [columns, setColumns] = useState<Reorder[]>([]);
    const [rows, setRows] = useState<RowsReorder>();
    const [clicking, setClicking] = useState("");
    const [DraggedElement, setDraggedElement] = useState<Task | Task_types | null>(null);
    const { editingSpecs, setEditingSpecs } = useEditingContext(); //change this to context 
    useEffect(() => {
        if (taskTypes) {
            setColumns(taskTypes.map((type) => ({ id: type.type_id })));
        }
    }, [taskTypes]);

    useEffect(() => {
        if (tasks) {
            setRows(tasks.reduce((acc, task) => {
                if (!acc[task.type_id]) acc[task.type_id] = [];
                acc[task.type_id].push({ id: task.task_id });
                return acc;
            }, {} as Record<string, Reorder[]>))
        }
    }, [tasks]);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function countTypeIds(tasks: Task[] | null) {
        if (!Array.isArray(tasks) || tasks?.length === 0) {
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


     








   useEffect(() => {
  if (!socket || !socketId) return;

  console.log("Socket initialized for user:", socketId);


  // 🔹 Task updated
  socket.on("task-updated", (task:Task) => {
      console.log("testuser",socketId);
      console.log("testtask-updated", task  );
      const prevTask = tasks?.find(t => t.task_id === task.task_id);
      console.log("test",prevTask);
      if (!prevTask?.idx) return;

    const modifier = task.idx < prevTask.idx ? 1 : -1;
    tasksSetState(prev => ({
      ...prev,
      data: prev.data
        ? prev.data.map(t =>
            t.task_id === task.task_id
              ? task
              : (t.type_id === task.type_id &&
                ((t.idx > prevTask.idx && t.idx <= task.idx) ||
                  (t.idx < prevTask.idx && t.idx >= task.idx)))
              ? { ...t, idx: t.idx + modifier }
              : t
          )
        : prev.data,
    }));
  });

  // 🔹 Task created
  socket.on("task-created", (task: Task) => {
    tasksSetState(prev => ({
      ...prev,
      data: prev.data ? [...prev.data, task] : prev.data,
    }));
  });

  // 🔹 Task deleted
  socket.on("task-deleted", ({id}) => {
    console.log("test task-deleted", id);
    tasksSetState(prev => ({
      ...prev,
      data: prev.data ? prev.data.filter(t => t.task_id !== id) : prev.data,
    }));
  });

  // 🔹 Task type updated
  socket.on("task-type-updated", ({activeId, overId}) => {

    const oldIndex = taskTypes?.findIndex(t => t.type_id === activeId);
    const newIndex = taskTypes?.findIndex(t => t.type_id === overId);

    if (typeof oldIndex === "number" && typeof newIndex === "number" && taskTypes) {
      setState(prev => ({
        ...prev,
        data: prev.data ? arrayMove(prev.data, oldIndex, newIndex) : prev.data,
      }));
    }
  });

  // 🔹 Task type created
  socket.on("task-type-created", (newTaskType: Task_types) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? [...prev.data, newTaskType] : prev.data,
    }));
  });

  // 🔹 Task type deleted
  socket.on("task-type-deleted", ({id}: {id:string}) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? prev.data.filter(t => t.type_id !== id) : prev.data,
    }));
  });

  // 🔹 Task text updated
  socket.on("task-text-updated", ({element, id}) => {
    setEditingSpecs(id);
    tasksSetState(prev => ({
      ...prev,
      data: prev.data ? prev.data.map(t => (t.task_id === element.task_id ? element : t)) : prev.data,
    }));
  });

  // 🔹 Column text updated
  socket.on("column-text-updated", ({element, id }) => {
    setEditingSpecs(id);
    setState(prev => ({
      ...prev,
      data: prev.data ? prev.data.map(t => (t.type_id === element.type_id ? element : t)) : prev.data,
    }));
  });

  return () => {
    socket.off("task-updated");
    socket.off("task-created");
    socket.off("task-deleted");
    socket.off("task-type-updated");
    socket.off("task-type-created");
    socket.off("task-type-deleted");
    socket.off("task-text-updated");
    socket.off("column-text-updated");
  };
}, [socket, socketId, setEditingSpecs, setState, taskTypes, tasks, tasksSetState]);

    const { tag } = router.query
    console.log(tag,"findme")
    const filteredTasks = useMemo(() => {
    return tag === "all" || tag === undefined
        ? tasks
        : tasks?.filter(task => task.tag_id === tag);
    }, [tasks, tag]);

    const taskTypeMap = useMemo(() => {
    return filteredTasks?.reduce((acc, task) => {
        acc[task.task_id] = task.type_id;
        return acc;
    }, {} as Record<string, string>);
    }, [filteredTasks]);

    return (
        <>
        { (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}

        >

            <Tools taskTypes={taskTypes} typeIdMap={typeIdMap} reFetch={reFetch} company_id={company_id} />
            <div id="kanban-table" className={`${clicking ? "cursor-grabbing" : ""} w-full h-[400px] bg-white border-[2px] overflow-hidden pt-6`}>
                <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                    <div className="scrollbar my-scroll flex flex-nowrap gap-8 overflow-x-auto w-full h-full">
                        {(loading || tasksLoading ) ? <ColumnSkeleton/> :
                        <>
                        <LiveMouseBoard/>
                            {taskTypes?.map((item) => (
                                <div key={item.type_name} className=" flex-shrink-0 w-[300px] " >
                                    <div className="relative w-full h-screen">
                                        <Column
                                            dragged={false}
                                            clicking={clicking}
                                            column={item}
                                            reFetch={tasksReFetch}
                                            columnTasks={filteredTasks?.filter(task => task.type_id === item.type_id) ?? []}
                                        />
                                </div>
                                </div>
                            ))}
                        </>
                        }
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
            <DeleteArea isDragging={clicking?.length > 0 ? true : false} />

        </DndContext>)}
        </>

    );
    async function handleDragStart(event: DragStartEvent) {
        if (editingSpecs) return;

        const { active } = event;
        const id = active.id;
        if (typeof (id) === 'string' && id[0] === 'c') {
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
        if (editingSpecs) return;
        const { active, over } = event;
        if (!over) return;

        setDraggedElement(null);
        setClicking("");
        if (over.id === "trash") {
            if (typeof (active.id) === "string" && active.id[0] === 'c') {

                await deleteColumn(active.id as string)
                reFetch();
            }
            else {


                await deleteRow(active.id as string);
                tasksReFetch();
            }
        }


        else if (active.id !== over.id) {
            if (typeof (active.id) === "string" && active.id[0] === 'c') {
                const oldIndex = taskTypes?.findIndex((i) => i.type_id === active.id);
                const newIndex = taskTypes?.findIndex((i) => i.type_id === over.id);
                const colOldIndex = columns?.findIndex((i) => i.id === active.id);
                const colNewIndex = columns?.findIndex((i) => i.id === over.id);
                const updatedColumns = arrayMove(columns, colOldIndex, colNewIndex)
                setColumns(updatedColumns);
                console.log('updatedd', oldIndex, newIndex);
                console.log("amajd", taskTypes, updatedColumns, columns);
               // if (taskTypes !== null && oldIndex !== undefined && newIndex !== undefined) console.log("updateddd", arrayMove(taskTypes, oldIndex, newIndex))
                if (taskTypes !== null && oldIndex !== undefined && newIndex !== undefined) setState((prev) => ({ ...prev, data: prev.data ? arrayMove(prev.data, oldIndex, newIndex) : prev.data }));

                if (typeof over.id === "string") {
                    const updated = await updateColumns(updatedColumns, active.id, over.id);
                    console.log("testing",updated);
                    
                }
            }
            else {
                if (!rows) return
                const newColumn = String(over.id)[0] === 't' ? tasks?.find((item) => item.task_id === over.id)?.type_id ?? undefined : over.id;;
                if (!newColumn) return;
                const oldIndex = rows[newColumn].findIndex((i) => i.id === active.id);
                const newIndex = rows[newColumn].findIndex((i) => i.id === over.id);
                console.log("qq", oldIndex, newIndex);
                const newRows = arrayMove(rows[newColumn], oldIndex, newIndex);
                setRows(prev => ({ ...prev, [newColumn]: newRows }));
                if (tasks !== null) {
                    const taskMap = new Map(tasks.map(t => [t.task_id, t]));

                    const reorderedTasks = newRows
                        .map(row => taskMap.get(row.id))
                        .filter((task): task is Task => !!task && task.type_id === newColumn);
                    console.log('ww', newRows, reorderedTasks)

                    tasksSetState(prev => ({
                        ...prev,
                        data: prev.data
                            ? [
                                // keep all tasks not in this column
                                ...prev.data.filter(t => t.type_id !== newColumn),
                                // add reordered tasks for this column
                                ...reorderedTasks
                            ]
                            : reorderedTasks,
                    }));
                }
                console.log('ww', tasks);
                await updateRows(newRows, String(newColumn), String(active.id));

                tasksReFetch();
            }
        }

    }

    function handleDragOver(event: DragOverEvent) {
        if (editingSpecs) return;
        const { active, over } = event;
        console.log("test2", over?.id);
        if (!over) return;
        if (typeof (active.id) === 'string' && active.id[0] === 'c') return;

        if (typeof (over.id) === "string" && over.id[0] === 'c') {
            tasksSetState(prev => {
                if (!prev?.data) return prev;
            
                updateRows([{ id: String(active.id) }], String(over.id), String(active.id));
                const index = prev.data.findIndex((t: Task) => t.task_id === active?.id);
                if (index === -1) return prev;

                const updatedTask = { 
                    ...prev.data[index], 
                    type_id: String(over.id), 
                    idx: 0 
                };

                const newData = [...prev.data];
                newData[index] = updatedTask;

                return { ...prev, data: newData };
            });
        }
        else if(typeof (over.id) === "string" && typeof (active.id) === "string" && active.id[0] === 't' && over.id[0] === 't'){
            const overId = taskTypeMap?.[over.id];
            const activeId = taskTypeMap?.[active.id];
            if(overId === activeId) return
            
            tasksSetState(prev => {
                if (!prev?.data) return prev;
                
                updateRows([{ id: String(active.id) }], String(overId), String(active.id));

                const index = prev.data.findIndex((t: Task) => t.task_id === active?.id);
                if (index === -1) return prev;

                const updatedTask = { 
                    ...prev.data[index], 
                    type_id: String(overId), 
                    idx: 0 
                };

                const newData = [...prev.data];
                newData[index] = updatedTask;

                return { ...prev, data: newData };
            });
        }
    }
}







// socket.on("connect", async () => {
//   await reFetchTasks(); // ensure missed updates are recovered
// });
