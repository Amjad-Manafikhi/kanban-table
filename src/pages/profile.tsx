import Layout from "@/components/Layout"
import PasswordUpdateForm from './../components/PasswordUpdateForm';
import NameUpdateForm from "@/components/NameUpdateForm";
export default function Dashboard(){
    
    return (
        <Layout>
            <div className="bg-gray-200  mt-10 border border-gray-200 rounded-md w-[80%] max-w-[500px] mx-auto py-2 px-5 flex items-center flex-col" >
                <h1 className="text-lg">Personal Infromation</h1>
                <NameUpdateForm/>
                <PasswordUpdateForm/>
            </div>
        </Layout>
    )
}