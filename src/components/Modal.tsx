import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "./ui/dialog"



type Props={
    open:boolean;
    setOpen:React.Dispatch<React.SetStateAction<boolean>>;
    title:string;
    children:ReactNode;
}

export default function Modal({children, open, setOpen, title}:Props){
    
    
    

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <h1>{title}</h1>
                    </DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    ) 
}