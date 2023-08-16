import { useState } from 'react'
import PlusIcon from '../icons/PlusIcon'
import { Column, Id } from '../types';
import ColumnContainer from './ColumnContainer';


function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);

    const generateId = () => {
        return Math.floor(Math.random() * 1001);
    }

    const handleCreateNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        }

        setColumns([...columns, columnToAdd])
    };

    const handleDeleteColumn = (id: Id) => {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);
    };

    return (
        <div
            className='
                m-auto
                flex
                min-h-screen
                w-full
                items-center
                overflow-x-auto
                overflow-y-hidden
                px-[40px]
            '
        >
            <div className='
                m-auto
                flex
                gab-4
            '
            >
                <div className='flex gap-4'>
                    {columns.map((col) => <ColumnContainer key={col.id} column={col} handleDeleteColumn={handleDeleteColumn} />)}
                </div>
                <button
                    onClick={handleCreateNewColumn}
                    className='
                        h-[60px]
                        w-[350px]
                        min-w-[350px]
                        cursor-pointer
                        rounded-lg
                        bg-mainBackgroundColor
                        border-2
                        border-columnBackgroundColor
                        p-4
                        ring-rose-500
                        hover:ring-2
                        flex
                        gab-2
                    '
                >
                    <PlusIcon />
                    Add column
                </button>
            </div>
        </div>
    )
}

export default KanbanBoard;
