import { useEffect, useState, useCallback } from "react";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: unknown | null;
};

export default function useFetchCompanyTasks<T>(url: string, company_id: number | undefined) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (company_id === undefined) return {
      data: null,
      loading: true,
      error: null,
    }
    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}${url}?company=${company_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        setState({ data: null, error: res.statusText, loading: false });
        return;
      }
      const data: T = await res.json();
      setState({ data, error: null, loading: false });
    } catch (error) {
      setState({ data: null, error, loading: false });
    }
  }, [url, company_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, reFetch: fetchData, setState };
}
