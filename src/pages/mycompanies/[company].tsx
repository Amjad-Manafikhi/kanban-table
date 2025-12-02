import { Task, Task_types } from "@/models/database";
import useFetchCompanyTasks from "@/hooks/useFetchCompanyTasks";
import KanbanTable, { Reorder } from "@/components/KanbanTable";
import { EditingProvider } from "@/contexts/EditingContext";

import { useRouter } from "next/router";
import { useSocket } from "@/hooks/useSocket";
import { useLayoutContext } from "@/contexts/LayoutContext";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyTasks() {

  const { companies } = useLayoutContext();
  

  const router = useRouter();
  const company = router.query.company;
  const company_id =companies?.find((item) => item.name === company)?.company_id ?? undefined;

  const userTaskTypes = useFetchCompanyTasks<Task_types[]>(
    "/api/task_types/read",
    company_id
  );
  const userTasks = useFetchCompanyTasks<Task[]>(
    "/api/tasks/read",
    company_id
  );

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
          company_id={company_id}
        />
      </EditingProvider>
    </>
  );

  async function updateColumns(
    newcolumns: Reorder[],
    activeId: string,
    overId: string
  ) {
    try {
      const res = await fetch(NEXT_PUBLIC_API_URL + "/api/task_types/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alignments: newcolumns,
          activeId,
          overId,
          socketId,
          company_id,
        }),
      });

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

  async function updateRows(
    newItems: Reorder[],
    overColumnId: string,
    activeTaskId: string
  ) {
    try {
      const res = await fetch(NEXT_PUBLIC_API_URL + "/api/tasks/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alignments: newItems,
          overColumnId,
          activeTaskId,
          socketId,
          company_id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("updated:", data);
      } else {
        console.error("update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating tasks order:", error);
    }
  }

  async function deleteColumn(id: string) {
    try {
      const res = await fetch(NEXT_PUBLIC_API_URL + "/api/task_types/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, socketId, company_id }),
      });

      if (res.ok) console.log("deleted successfully");
      else console.error("delete failed");
    } catch (error) {
      console.error("Error deleting from task_types:", error);
    }
  }

  async function deleteRow(id: string) {
    try {
      const res = await fetch(NEXT_PUBLIC_API_URL + "/api/tasks/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, socketId, company_id }),
      });

      if (res.ok) console.log("deleted successfully");
      else console.error("delete failed");
    } catch (error) {
      console.error("Error deleting from tasks:", error);
    }
  }
}
