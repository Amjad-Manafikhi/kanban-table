import { useEditingContext } from '@/contexts/EditingContext';
import React, { useState, useRef, useEffect, ReactNode, SetStateAction, Dispatch } from 'react';
import toast from 'react-hot-toast';
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export type TextLoading = {
    loading:String;
    textValue:string;
} 

export type QueryData = {
    tableName:string;
    columnName:string;
    rowId:string;
    rowIdName:string;
}

type UpdateQuery=QueryData & {value:string}

type Props ={
    children:ReactNode;
    initialText:string;
    queryData:QueryData;
    setLoading: React.Dispatch<React.SetStateAction<TextLoading>>;
} 


export default function UpdateText({ children, initialText, queryData, setLoading}:Props) {
    
  const { editingSpecs, setEditingSpecs } = useEditingContext();
  const [ editing, setEditing ] = useState(false);
  const [changedValue, setChangedValue] = useState(false);


  const [flash, setFlash] = useState(false);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 2500); // 3 cycles × 0.5s
  };

    // 1. State to manage the current text value
  const [text, setText] = useState(initialText);
 
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
    setEditingSpecs(true);
    setEditing(true);

  };

  // Handler to update local state on input change
  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      if(changedValue === false && event.target.value !== text)setChangedValue(true);
      setText(event.target.value);
  };

  // Handler to save changes and exit edit mode
  const handleSave = (triggerFlash:() => void) => {
    setEditingSpecs(false);
    setEditing(false);
    if(changedValue===true){
        triggerFlash();
        updateText({ 
        rowId:queryData.rowId,
        rowIdName:queryData.rowIdName,
        value: text, 
        tableName:queryData.tableName,
        columnName:queryData.columnName,
    },setLoading)}
  }
 

  // Handler to save on pressing Enter and exit on pressing Escape
  const handleKeyDown = (event:React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave(triggerFlash);
    } else if (event.key === 'Escape') {
      // Revert text to original if you don't want to save on Escape
      // For simplicity, we just exit edit mode here.
      setEditingSpecs(false); 
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
        <div onDoubleClick={handleDoubleClick} className={`cursor-pointer ${flash ? "flash-text" : ""} z-50 `} >
            {children}
            <style jsx>{`
                .flash-text {
                animation: flash-green 1s  3;
                }
                @keyframes flash-green {
                0%, 100% { color: white; }
                50% { color: #61D345; }
                }
            `}</style>
        </div>
      )}
    </div>
  );
}

async function updateText(queryData:UpdateQuery , setLoading:React.Dispatch<React.SetStateAction<TextLoading>>){ 
    setLoading({
        loading:"loading",
        textValue:queryData.value
    })
    const updatePromise = fetch(
        NEXT_PUBLIC_API_URL + "/api/textUpdate",
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(queryData),
        }
    );
    
    
    try {
      const res = await toast.promise(updatePromise, {
            loading: 'Updating...',
            success: 'Updated Successfully',
            error: 'Updating Failed',
        });
    
      if (res.ok) {
        
        setLoading({
            loading:"true",
            textValue:queryData.value
        });
      } else {
        console.error("update failed");
        
        setLoading({
            loading:"false",
            textValue:queryData.value
        })  
      }
    } catch (error) {
        console.error(`Error updating text ${queryData.tableName}:`, error);
        setLoading({
            loading:"false",
            textValue:queryData.value
        });
    }
    // Call the parent's function to update the external state/database
  };
