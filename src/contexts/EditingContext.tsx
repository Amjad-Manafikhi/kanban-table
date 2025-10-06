import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  editingSpecs: boolean;
  setEditingSpecs: React.Dispatch<React.SetStateAction<boolean>>;

}

export const EditingContext = createContext<ContextType | undefined>(undefined);



export const EditingProvider = ({ children }: { children: React.ReactNode }) => {
  const [editingSpecs, setEditingSpecs] = useState<boolean>(false)

  return (
    <>
      <EditingContext.Provider value={{ editingSpecs, setEditingSpecs }}>
        {children}
      </EditingContext.Provider>
    </>
  )
}

export function useEditingContext() {
  const specs = useContext(EditingContext);

  if (specs === undefined) {
    throw new Error('useUserContext must be used with a DashboardContext');
  }

  return specs;
}