import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';
type Props = {
  isDragging: boolean;
}

export default function DeleteArea({ isDragging }: Props) {
  const { setNodeRef } = useDroppable({
    id: 'trash',
  });


  return (
    <div ref={setNodeRef} style={{ bottom: isDragging ? 0 : -120, backgroundColor: isDragging ? "#fb2c36" : "white" }} className="fixed w-full flex items-center justify-center bg-red-500 h-20 z-50 left-0 transition-colors ">
      <Trash2 className='w-6 h-6 text-white' />
    </div>
  );
}