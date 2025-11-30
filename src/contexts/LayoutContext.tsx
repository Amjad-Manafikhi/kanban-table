import { Company } from '@/models/database';
import React, { createContext, useContext, useState } from 'react';


type ContextType ={
    companies:Company[];
    setCompanies:React.Dispatch<React.SetStateAction<Company[]>>;
    reFetchSidebarCompanies:boolean;
    setReFetchSidebarCompanies:React.Dispatch<React.SetStateAction<boolean>> ;
    firstName:string;
    setFirstName:React.Dispatch<React.SetStateAction<string>>
}



export const LayoutContext = createContext<ContextType | undefined>(undefined);



export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]); // ✅ store resolved data
  const [reFetchSidebarCompanies, setReFetchSidebarCompanies] = useState(false);
  const [firstName, setFirstName] = useState<string>("")

  return (
    <>
      <LayoutContext.Provider value={{ companies, setCompanies, reFetchSidebarCompanies, setReFetchSidebarCompanies, firstName, setFirstName }}>
        {children}
      </LayoutContext.Provider>
    </>
  )
}

export function   useLayoutContext() {
  const specs = useContext(LayoutContext);

  if (specs === undefined) {
    throw new Error('useLayoutContext must be used with a LayoutContext');
  }

  return specs;
}