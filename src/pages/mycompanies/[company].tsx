import React, { useState } from "react";
import { Company, Task, Task_types } from "@/models/database";
import useFetchCompanyTasks from "@/hooks/useFetchCompanyTasks";
import Layout from "@/components/Layout";
import KanbanTable, {Reorder} from "../../components/KanbanTable"
import { EditingProvider } from "@/contexts/EditingContext";
import ColumnForm  from "../../components/ColumnForm"
import Modal from "@/components/Modal";
import { useRouter } from "next/router";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function MyTasks() {

  const router = useRouter();
  const company = router.query.company;
  const [companies, setCompanies] = useState<Company[]>();
  const company_id = companies?.find((item) => item.name === company)?.company_id ?? undefined;

  
  const [ OpenForm, setOpenForm ] = useState(false); 
  const userTaskTypes = useFetchCompanyTasks<Task_types[]>("/api/task_types/read",company_id);
  const userTasks = useFetchCompanyTasks<Task[]>("/api/tasks/read", company_id);
  


  

  
  if (userTasks.loading) return <p>Loading...</p>;

  return (
      
      
        <Layout setPageCompanies={setCompanies}>
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

    

  async function updateColumns(newcolumns:Reorder[]) {
    try {
      const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/task_types/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alignments: newcolumns}),
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
