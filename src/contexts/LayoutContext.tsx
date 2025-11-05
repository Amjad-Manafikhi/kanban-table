import { Company } from '@/models/database';
import React, { createContext, useContext, useState } from 'react';


type ContextType ={
    companies:Company[];
    setCompanies:React.Dispatch<React.SetStateAction<Company[]>>;
    reFetchSidebarCompanies:boolean;
    setReFetchSidebarCompanies:React.Dispatch<React.SetStateAction<boolean>> ;
}



export const LayoutContext = createContext<ContextType | undefined>(undefined);



export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]); // ✅ store resolved data
  const [reFetchSidebarCompanies, setReFetchSidebarCompanies] = useState(false);

  return (
    <>
      <LayoutContext.Provider value={{ companies, setCompanies, reFetchSidebarCompanies, setReFetchSidebarCompanies }}>
        {children}
      </LayoutContext.Provider>
    </>
  )
}

export function useLayoutContext() {
  const specs = useContext(LayoutContext);

  if (specs === undefined) {
    throw new Error('useLayoutContext must be used with a LayoutContext');
  }

  return specs;
}