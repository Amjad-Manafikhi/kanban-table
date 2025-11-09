import React, { ReactNode, useEffect, useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";
import { Company } from "@/models/database";
import { useRouter } from "next/router";
import { useLayoutContext } from "@/contexts/LayoutContext";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

type LayoutProps = {
  children: ReactNode;
  setPageCompanies?:React.Dispatch<React.SetStateAction<Company[]|undefined>>
  reFetchSidebarCompanies?:boolean;
};

export default function Layout({ children, setPageCompanies }: LayoutProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const company = router.query.company;
  const { companies, setCompanies, reFetchSidebarCompanies } = useLayoutContext();

  useEffect(() => {
    async function setData() {
      try {
        const data = await getCompanies(); // ✅ await here
        if (data!==undefined) {
          if(company && typeof(company) === 'string' && data.findIndex((item) => item.name === company)) router.push("/404");
          setCompanies(data);
          if(setPageCompanies)setPageCompanies(data)
        }
      } finally {
        setLoading(false);
      }
    }
    setData();
  },[company, setPageCompanies, router, reFetchSidebarCompanies, setCompanies]);

  if(loading)return <p>Loading...</p>

  return (
    
    <SidebarProvider>
      <AppSidebar companies={companies} /> {/* ✅ pass data */}
      <main className="w-full mx-auto overflow-hidden">
        <Navbar />
        <div className="flex flex-col px-10 w-full h-full">{children}</div>
      </main>
    </SidebarProvider>
    
  );
}

async function getCompanies(): Promise<Company[] | undefined> {
  try {
    const res = await fetch(NEXT_PUBLIC_API_URL + "/api/user_company/read", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch companies");
    }

    const data: Company[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error reading companies:", error);
  }
}
