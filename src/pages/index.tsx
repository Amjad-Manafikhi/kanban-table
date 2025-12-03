import { Task, Task_types } from "@/types/database";
import useFetchUserTasks from "@/hooks/useFetchUserTasks";
import KanbanTable, { Reorder } from "../components/kanban/KanbanTable"
import { EditingProvider } from "@/contexts/EditingContext";
import { useSocket } from './../hooks/useSocket';
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function MyTasks() {

  const userTaskTypes = useFetchUserTasks<Task_types[]>("/api/task_types/read");
  const userTasks = useFetchUserTasks<Task[]>("/api/tasks/read");
  const { socketId } = useSocket();







  return (


    <>
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


    </>
  );



  async function updateColumns(newcolumns: Reorder[], activeId: string, overId: string) {
    try {
      const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/task_types/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alignments: newcolumns, activeId, overId, socketId }),
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

  async function updateRows(newItems: Reorder[], overColumnId: string, activeTaskId: string) {
    try {
      const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/tasks/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alignments: newItems, overColumnId: overColumnId, activeTaskId, socketId }),
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
          body: JSON.stringify({ id, socketId }),
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

  async function deleteRow(id: string) {
    try {
      const res = await fetch(
        NEXT_PUBLIC_API_URL + "/api/tasks/delete",
        {
          method: "delete",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, socketId }),
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



