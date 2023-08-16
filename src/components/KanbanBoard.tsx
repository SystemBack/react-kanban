import { useMemo, useState } from 'react'
import PlusIcon from '../icons/PlusIcon'
import { Column, Id } from '../types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';



function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const sensors = useSensors(
            useSensor(PointerSensor, {
                activationConstraint: {
                    distance: 3,
                },
            })
    );

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

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const handleOnColumnDragStart = (event: DragStartEvent) => {
        const current = event.active.data.current;
        if (current?.type === 'Column') {
            setActiveColumn(current?.column);
        }
    };

    const handleOnColumnDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if(activeColumnId === overColumnId) return;

        setColumns((cols) => {
            const activeColumnIndex = cols.findIndex((col) => col.id === activeColumnId);
            const overColumnIndex = cols.findIndex((col) => col.id === overColumnId);

            return arrayMove(cols, activeColumnIndex, overColumnIndex);
        });
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
            <DndContext sensors={sensors} onDragStart={handleOnColumnDragStart} onDragEnd={handleOnColumnDragEnd}>
                <div className='
                    m-auto
                    flex
                    gab-4
                '
                >
                    <div className='flex gap-4'>
                    <SortableContext items={columnsId}>
                        {columns.map((col) => <ColumnContainer key={col.id} column={col} handleDeleteColumn={handleDeleteColumn} />)}
                    </SortableContext>
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
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer column={activeColumn} handleDeleteColumn={handleCreateNewColumn}/>
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    )
}

export default KanbanBoard;
