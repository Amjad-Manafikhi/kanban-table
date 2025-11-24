import PasswordUpdateForm from './../components/PasswordUpdateForm';
import NameUpdateForm from "@/components/NameUpdateForm";
import CreateCompany from "@/components/CreateCompany";
import AddUserToCompany from "@/components/AddUserToCompany";
import React from "react";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(ctx:GetServerSidePropsContext) {
  const token = ctx.req.cookies.session;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}


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

