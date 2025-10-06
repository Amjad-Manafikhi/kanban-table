import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
export type FetchState<T> = {
    data: T|null ;
    loading: boolean;
    error: unknown | null;
}



export default function useFetchUserTasks<T>(url:string) {
    const [userId, setUserId] = useState<number>();
    useEffect(() => {
        async function getUser() {
            try {
                const res = await fetch(NEXT_PUBLIC_API_URL + "/api/auth/me", {
                    credentials: "include", // ensures cookies are sent
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
    const [state, setState] = useState<FetchState<T>>({ data:null, loading: true, error: null });
    async function fetchData() {
        try {
            const dataRes = await fetch(`${NEXT_PUBLIC_API_URL}${url}?userId=${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        )


            if (!dataRes.ok) {
                setState(
                    {
                        error: null,
                        data: null,
                        loading: false,
                    }
                );
                return;
            }

            const data: T = await dataRes.json();

            setState({
                error: null,
                data: data,
                loading: false,
            }
            );
        } catch (error) {
            console.error(error);
            setState({
                error: error,
                data: null,
                loading: false,
            });
            return error;
        }
    }

    useEffect(() => {


        fetchData();
    }, [url,userId]);

    return { ...state, reFetch: () => fetchData(), setState };

}