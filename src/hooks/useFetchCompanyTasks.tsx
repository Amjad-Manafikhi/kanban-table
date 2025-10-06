import { useEffect, useState } from "react";


const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
export type FetchState<T> = {
    data: T|null ;
    loading: boolean;
    error: unknown | null;
}



export default function useFetchComapnyTasks<T>(url:string, company_id:number|undefined ) {
    const [state, setState] = useState<FetchState<T>>({ data:null, loading: true, error: null });
    async function fetchData() {
        try {
            const dataRes = await fetch(`${NEXT_PUBLIC_API_URL}${url}?company=${company_id}?`, {
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
            console.log("data",data)

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
    }, [url,company_id]);

    return { ...state, reFetch: () => fetchData(), setState };

}