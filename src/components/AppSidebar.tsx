import {
  FaBookOpen,       // Course
  FaUserTie         // Supervisor
} from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import  styles from'./../styles/scrollbar.module.css';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {useState} from "react"
import { Company } from "@/models/database";

type SidebarElement={
  id: number;
  title:string,
  url:string,
  icon: React.ComponentType<{className:string}>; 
}
type Props ={
  companies:Company[];
}
export function AppSidebar( { companies }:Props) {


  const [companiesIsOpen, setCompaniesIsOpen] = useState(false);
  const pathname = usePathname();


  const tables =  [
    { id: 1, title: "My Tasks", url: "/mytasks", icon: FaBookOpen },

  ]

  const settings = [
    { id: 1, title: "Profile", url: "/profile", icon: FaUserTie },
  ]

  
  const companiesItems = companies!==undefined && companies.map((company:Company)=>{
    const isActive = pathname === `/mycompanies/${company.name}`;
    return(
      <SidebarMenuSubItem key={company.company_id}className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-blue-500 hover:text-white",
          isActive
            ? "bg-blue-500 text-white"
            : ""
      )}>

        <Link href={`/mycompanies/${company.name}`} passHref>
          <span >{company.name}</span>
        </Link>
      </SidebarMenuSubItem >
    )
  })


  function sidebarElements(elements:SidebarElement[]){ 
    return elements.map((table) => {
            const Icon = table.icon;
            const isActive = pathname === table.url;
            return (  
              <SidebarMenuItem key={table.title}>
                <SidebarMenuButton asChild
                  className={cn(
                    "flex items-center gap-2 my-1 rounded-md px-4 py-2 transition-colors hover:bg-blue-500 hover:text-white",
                    isActive
                      ? "bg-blue-500 text-white"
                      : ""
                  )}
                >
                  
                <Link href={table.url} passHref 
                  
                  >
                    <Icon className="w-4 h-4" />
                    <span>{table.title}</span>
                </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
      }

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="flex flex-col justify-start items-start border-0" >
      <SidebarHeader />
      <SidebarContent className={cn(styles.sidebar,"bg-white border-0")}>
        <SidebarGroup className={" w-[94%]  mx-auto border-b-[2px] "}>
          <SidebarGroupLabel style={{"fontSize":"1.3rem","color":"#888888"}}>Settings</SidebarGroupLabel>
          <SidebarGroupContent>

            {sidebarElements(settings)}
          </SidebarGroupContent>
        </SidebarGroup>

          <SidebarGroup className={" bg-white w-[94%] mx-auto border-b-[2px] "}>
            <SidebarGroupLabel style={{"fontSize":"1.3rem","color":"#888888"}}>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>

              {sidebarElements(tables)}
               
               <Collapsible open={companiesIsOpen} onOpenChange={setCompaniesIsOpen} className="group/collapsible">
                <SidebarMenuItem>
                 
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={cn(
                    "flex items-center gap-2 my-1 rounded-md px-4 py-2 transition-colors hover:bg-blue-500 hover:text-white cursor-pointer",
                    
                  )}
                    >
                        <FaUserTie className="w-4 h-4 " />
                        <p className="flex justify-between w-full ">My Companies 
                          {companiesIsOpen ? <ChevronUp className="w-4 h-4 mt-1"/> : <ChevronDown className="w-4 h-4 mt-1"/> } 
                        </p>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {companiesItems}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                
                </SidebarMenuItem>
              </Collapsible>
            
            </SidebarGroupContent>
          </SidebarGroup>
        
        
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
