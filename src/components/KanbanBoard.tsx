import { useMemo, useState } from 'react'
import PlusIcon from '../icons/PlusIcon'
import { Column, Id, Task } from '../types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { COLUMN_KEY_TEXT } from '../utils/constants';



function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

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

    const handleChangeColumn = (id: Id, title: string) => {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return;
            return {...col, title};
        });

        setColumns(newColumns);
    };

    const handleCreateTask = (id: Id) => {
        const newTask: Task = {
            id: generateId(),
            columnId: id,
            content: `Task ${tasks.length +1}`,
        }

        setTasks([...tasks, newTask]);
    };

    const handleDeleteTask = (taskId: Id) => {
        const filteredTasks = tasks.filter((task) => task.id !== taskId);

        setTasks(filteredTasks);
    }

    const handleChangeTask = (id: Id, content: string) => {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return{...task, content};
        });

        setTasks(newTasks)
    }

    const createColumnComponent = (column: Column) =>  {
        return (
            <ColumnContainer
                key={column.id}
                column={column}
                tasks={filterTaskByColumn(column.id)}
                handleDeleteColumn={handleDeleteColumn}
                handleChangeColumn={handleChangeColumn}
                handleCreateTask={handleCreateTask}
                handleDeleteTask={handleDeleteTask}
                handleChangeTask={handleChangeTask}
            />
        );
    }

    const filterTaskByColumn = (columId: Id) => {
        return tasks.filter((task) => task.columnId === columId);
    }

    const handleOnColumnDragStart = (event: DragStartEvent) => {
        const current = event.active.data.current;
        if (current?.type === COLUMN_KEY_TEXT) {
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
                    <div
                        className='
                        flex
                        gap-4
                    '>
                        <SortableContext items={columnsId}>
                            {columns.map((col) => createColumnComponent(col))}
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
                            ring-cyan-500
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
                        {activeColumn && createColumnComponent(activeColumn)}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    )
}

export default KanbanBoard;
