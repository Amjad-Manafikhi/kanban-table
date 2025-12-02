import { useEditingContext } from '@/contexts/EditingContext';
import { FetchState } from '@/hooks/useFetchUserTasks';
import { useSocket } from '@/hooks/useSocket';
import { Task, Task_types } from '@/models/database';
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;


export type QueryData = {
    tableName:string;
    columnName:string;
    rowId:string;
    rowIdName:string;
}

type UpdateQuery=QueryData & {value:string ,socketId:string|null}

type Props ={
    children:ReactNode;
    initialText:string;
    queryData:QueryData;
    id:string;
    tasksSetState?:React.Dispatch<React.SetStateAction<FetchState<Task[]>>> 
    setState?:React.Dispatch<React.SetStateAction<FetchState<Task_types[]>>> 
} 


 function UpdateText({ children, initialText, queryData, id, setState, tasksSetState}:Props) {
    
  const { editingSpecs, setEditingSpecs } = useEditingContext();
  const [ editing, setEditing ] = useState(false);
  const [changedValue, setChangedValue] = useState(false);
  const { socketId } = useSocket(); 



  const [flash, setFlash] = useState(false);

  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

  const triggerFlash = () => {
    setFlash(true);
    console.log("trigger2")
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlash(false), 2500); // matches animation length
  };

  useEffect(()=>{
    if(editingSpecs===id && !editing) {
      setEditingSpecs("");
      triggerFlash();
    }
  },[editingSpecs, id, editing, setEditingSpecs])

    // 1. State to manage the current text value
  const [text, setText] = useState(initialText);
  useEffect(() => {
    setText(initialText);     // sync when parent changes
  }, [initialText]);
 
  // 3. Ref to focus the input field when edit mode starts
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when isEditing becomes true
  useEffect(() => {
    if (editingSpecs && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSpecs]);

  // Handler to activate edit mode on double-click
  const handleDoubleClick = () => {
    setEditingSpecs(id);
    setEditing(true);

  };

  // Handler to update local state on input change
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      if(changedValue === false && event.target.value !== text)setChangedValue(true);
      setText(event.target.value);
  };

  // Handler to save changes and exit edit mode
  const handleSave = async (triggerFlash:() => void) => {
    setEditingSpecs("");
    setEditing(false);
    if(changedValue===true){
      await updateText({ 
        rowId:queryData.rowId,
        rowIdName:queryData.rowIdName,
        value: text, 
        tableName:queryData.tableName,
        columnName:queryData.columnName,
        socketId:socketId
        
      }, id, setState, tasksSetState)
      console.log("trigger");
      triggerFlash();
    }
      setChangedValue(false);

  }
 

  // Handler to save on pressing Enter and exit on pressing Escape
  const handleKeyDown = (event:React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave(triggerFlash);
    } else if (event.key === 'Escape') {
      // Revert text to original if you don't want to save on Escape
      // For simplicity, we just exit edit mode here.
      setEditingSpecs(""); 
      setEditing(false); 
    }
  };

  return (
      <div className="editable-container">
      {editing ? (
        // EDIT MODE: Show the input field
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={()=>handleSave(triggerFlash)}// Exit edit mode when the input loses focus
          onKeyDown={handleKeyDown}
          className='p-1 w-full '
          
        />
      ) : (
        // DISPLAY MODE: Show the text, activate edit on double-click
        <div onDoubleClick={handleDoubleClick} className={`cursor-pointer  z-50 `} >
            <span className={flash ? "flash-text" : id[0]==='d' ? "text-[#4a5565]":"text-black"  }>{children}</span>
            <style jsx>{`
                .flash-text {
                animation: flash-green 1s 3 !important;
                }
                @keyframes flash-green {
                0%, 100% { color: black ; }
                50% { color: #61D345; }
                }
            `}</style>
        </div>
      )}
    </div>
  );
}

async function updateText(queryData:UpdateQuery, id:string, setState:React.Dispatch<React.SetStateAction<FetchState<Task_types[]>>>|undefined, tasksSetState:React.Dispatch<React.SetStateAction<FetchState<Task[]>>> | undefined){ 
  const updatePromise = fetch(
        NEXT_PUBLIC_API_URL + "/api/textUpdate",
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({queryData,id}),
        }
    );
    
    
    try {
      const res = await toast.promise(updatePromise, {
            loading: 'Updating...',
            success: 'Updated Successfully',
            error: 'Updating Failed',
          });
          
          if (res.ok) {
            
        // property to update title-task-id

        const part1 = queryData.columnName;
        const part2 = queryData.rowId;

        if(tasksSetState)tasksSetState(prev => ({
          ...prev,
          data: prev.data ? prev.data.map(t => (t.task_id === part2 ? {...t, [part1]:queryData.value} : t)) : prev.data,
        }));
        
        else if(setState)setState(prev => ({
          ...prev,
          data: prev.data ? prev.data.map(t => (t.type_id === part2 ? {...t, [part1]:queryData.value} : t)) : prev.data,
        }));

        
      } else {
        console.error("update failed");  
      }
    } catch (error) {
        console.error(`Error updating text ${queryData.tableName}:`, error);

    }
    // Call the parent's function to update the external state/database
  };


  export default React.memo(UpdateText)