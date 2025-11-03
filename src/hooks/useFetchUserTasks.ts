import { useEffect, useState, useCallback } from "react";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: unknown | null;
};

export default function useFetchUserTasks<T>(url: string) {
  const [userId, setUserId] = useState<number>();
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Fetch user ID once
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data: number = await res.json();
        setUserId(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    getUser();
  }, []);

  // Stable fetch function
  const fetchData = useCallback(async () => {
    if (!userId) return; // skip if userId not yet loaded
    try {
      const dataRes = await fetch(`${NEXT_PUBLIC_API_URL}${url}?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!dataRes.ok) {
        setState({ error: null, data: null, loading: false });
        return;
      }

      const data: T = await dataRes.json();
      setState({ error: null, data, loading: false });
    } catch (error) {
      console.error(error);
      setState({ error, data: null, loading: false });
    }
  }, [url, userId]);

  // Fetch data once userId is available
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, reFetch: fetchData, setState };
}
