import { useEffect, useState } from "react";
 import {Task_types } from "@/models/database";;
export type ColumnsMap = Record<string, { type_id: string; idx: number }>;

export async function useColumnsMap(taskTypes: Task_types[]) {
  const [columnsMap, setColumnsMap] = useState<ColumnsMap>({});

  useEffect(() => {
    if (taskTypes.length > 0) {
      const map = Object.fromEntries(
        taskTypes.map((type) => [
          type.type_name,
          { type_id: type.type_id, idx: type.idx },
        ])
      );
      setColumnsMap(map);
    }
  }, [taskTypes]);

  return columnsMap;
}
