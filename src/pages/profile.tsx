import PasswordUpdateForm from '../components/forms/PasswordUpdateForm';
import NameUpdateForm from "@/components/forms/NameUpdateForm";
import CreateCompany from "@/components/profile/CreateCompany";
import AddUserToCompany from "@/components/profile/AddUserToCompany";
import React from "react";
import { useLayoutContext } from "@/contexts/LayoutContext";



export default function Profile(){

    const { setReFetchSidebarCompanies } = useLayoutContext();
    return (
        <>
            <div className="bg-gray-200  mt-10 border border-gray-200 rounded-md w-[80%] max-w-[500px] mx-auto py-2 px-5 flex items-center flex-col" >
                <h1 className="text-lg">Personal Infromation</h1>
                <NameUpdateForm/>
                <PasswordUpdateForm/>
                <CreateCompany setReFetchSidebarCompanies={setReFetchSidebarCompanies}/>
                <AddUserToCompany/>
            </div>
            
            
        </>
    )
}

