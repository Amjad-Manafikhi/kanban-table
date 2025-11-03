import React, { useState } from "react";
import { Task, Task_types } from "@/models/database";
import useFetchUserTasks from "@/hooks/useFetchUserTasks";
import Layout from "@/components/Layout";
import KanbanTable, {Reorder, RowsReorder} from "../components/KanbanTable"
import { EditingProvider } from "@/contexts/EditingContext";
import ColumnForm  from "../components/ColumnForm"
import Modal from "@/components/Modal";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function MyTasks() {

  const [ OpenForm, setOpenForm ] = useState(false); 
  const userTaskTypes = useFetchUserTasks<Task_types[]>("/api/task_types/read");
  const userTasks = useFetchUserTasks<Task[]>("/api/tasks/read");
  


  

  
  if (userTasks.loading) return <p>Loading...</p>;

  return (
      
      
        <Layout >
            <EditingProvider>
                <KanbanTable
                    userTasks={userTasks}
                    userTaskTypes={userTaskTypes}
                    updateColumns={updateColumns}
                    updateRows={updateRows}
                    deleteColumn={deleteColumn}
                    deleteRow={deleteRow}
                />
            </EditingProvider>
            {OpenForm && 
                <Modal open={OpenForm} setOpen={setOpenForm} title={"Add New Type"} >
                    <ColumnForm idx={userTaskTypes.data?.length} refetch={userTaskTypes.reFetch} setOpen={setOpenForm}/>
                </Modal>
            }
            <button 
                className="fixed bottom-8 right-8 rounded-full cursor-pointer bg-black opacity-85 shadow-md w-8 h-8 text-white "
                onClick={() => setOpenForm(true)}    
            >+</button>

        </Layout>
  );

    

  async function updateColumns(newcolumns:Reorder[], activeId:string, overId:string) {
    try {
      const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/task_types/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alignments: newcolumns,activeId, overId}),
        }
      );
      
      const data = await res.json();

      if (res.ok) {
        console.log("updated:", data);
        return data.data;
      } else {
        console.error("update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating task_types order:", error);
    }
  }
  
  async function updateRows(newItems: Reorder[], overColumnId:string, activeTaskId:string){
      try {
      const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/tasks/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alignments: newItems, overColumnId:overColumnId, activeTaskId }),
        }
      );
      
      const data = await res.json();

      if (res.ok) {
        console.log("updated:", data);
      } else {
        console.error("update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating task_types order:", error);
    }
  }



  async function deleteColumn(id: string) {
    try {
    const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/task_types/delete",
        {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id}),
        }
    );
    

    if (res.ok) {
        console.log("deleted successfully");
    } else {
        console.error("delete failed");
    }
    } catch (error) {
    console.error("Error deleting from task_types:", error);
    }
   }

  async function deleteRow(id:string){
    try {
    const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/tasks/delete",
        {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id:id }),
        }
    );
    

    if (res.ok) {
        console.log("deleted successfully");
    } else {
        console.error("delete failed");
    }
    } catch (error) {
    console.error("Error deleting from:", error);
    }
   }

  

}



