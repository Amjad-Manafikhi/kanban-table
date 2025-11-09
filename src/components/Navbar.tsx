import { SidebarTrigger } from './ui/sidebar';
import Link from "next/link";
import  Cookies from 'js-cookie'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export const Navbar = () =>{
    const router= useRouter(); 
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    
    useEffect(() => {
        const isLogged = Cookies.get('loggedIn') === 'true';
        setLoggedIn(isLogged);
    }, []);

    async function logout() {
        try {
            const response = await fetch('/api/auth/logout', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) {
            console.error('Logout failed');
            return;
            }

            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
        }

    
    return (
        <header className=" w-full h-12 bg-white shadow-sm border border-l-white border-gray-100 sticky  flex flex-wrap justify-between px-16 items-center z-5">
            <div className='flex gap-4'>
                <SidebarTrigger/>
                <h2 className='text-lg'>Task Management System</h2>
            </div>
            {!loggedIn && <div className="flex gap-2 ml-auto mr-5">
                <Link href="/login" className="">Log in</Link>
                <Link href="/signup" className="">Sign up</Link>
            </div>}

            {loggedIn&& <div className="flex ml-auto ">
                <button className="" onClick={logout}>Log out</button>
                
            </div>}
        </header>
    )
}
export default Navbar 