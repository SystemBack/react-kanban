import { useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types"
import { CSS } from '@dnd-kit/utilities'
import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { FocusEventUtil } from "../utils/EventsUtils";
import TaskContainer from "./TaskContainer";
import { ENTER_KEY_TEXT, COLUMN_KEY_TEXT } from "../utils/constants";
import DeleteButton from "./DeleteButton";

interface Props {
    column: Column,
    tasks: Task[]
    handleDeleteColumn: (id: Id) => void;
    handleChangeColumn: (id: Id, title: string) => void;
    handleCreateTask: (columnId: Id) => void;
    handleDeleteTask: (columnId: Id) => void;
    handleChangeTask: (id: Id, content: string) => void;
}

function ColumnContainer(props: Props) {
    const {
            column,
            tasks,
            handleDeleteColumn,
            handleChangeColumn,
            handleCreateTask,
            handleDeleteTask,
            handleChangeTask
        } = props;
    const { setFocusOnEnd } = FocusEventUtil()
    const [ isEditModule, setIsEditModule ] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: COLUMN_KEY_TEXT,
            column,
        },
        disabled: isEditModule
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const inputColumnTitle = () => {
        return (
            <input
                autoFocus
                onFocus={(e) => setFocusOnEnd(e)}
                value={column.title}
                onChange={(e) => handleChangeColumn(column.id, e.target.value)}
                onBlur={() => {
                    setIsEditModule(false);
                }}
                onKeyDown={(e) => {
                    if (e.key !== ENTER_KEY_TEXT) return;
                    setIsEditModule(false);
                }}
                className="
                    bg-black
                    focus:border-cyan-500
                    border
                    rounded
                    outline-none
                    px-2
            "/>
        );
    }

    const createTaskContent = (task: Task) => {
        return (
            <TaskContainer
                key={task.id}
                task={task}
                handleDeleteTask={handleDeleteTask}
                handleChangeTask={handleChangeTask}
            />
        );
    }

    if(isDragging) {
        return (
        <div
            ref={setNodeRef}
            style={style}
            className="
                opacity-40
                border-2
                border-cyan-500
                bg-columnBackgroundColor
                w-[350px]
                h-[500px]
                max-h-[500px]
                rounded-md
                flex
                flex-col
        ">
            Hello!
        </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
                bg-columnBackgroundColor
                w-[350px]
                h-[500px]
                max-h-[500px]
                rounded-md
                flex
                flex-col
            ">
            <div
                {...attributes}
                {...listeners}
                onClick={() => setIsEditModule(true)}
                className="
                    bg-mainBackgroundColor
                    text-md
                    h-[60px]
                    m-1/2
                    cursor-grab
                    rounded-xl
                    rounded-b-none
                    p-3
                    font-bold
                    border-columnBackgroundColor
                    border-4
                    flex
                    items-center
                    justify-between
                ">
                <div className="flex gab-2">
                    <div className="
                            flex
                            justify-center
                            items-center
                            bg-columnBackgroundColor
                            px-2
                            py-1
                            text-sm
                            rounded-full
                        ">
                        0
                    </div>
                    {!isEditModule && column.title}
                    {isEditModule && inputColumnTitle()}
                </div>
                <DeleteButton id={column.id} handleClickAction={handleDeleteColumn} />
            </div>
            <div className="
                    flex
                    flex-grow
                    flex-col
                    gab-2
                    p-1
                    overflow-x-hidden
                    overflow-y-auto
                ">
                {tasks.map((task) => createTaskContent(task))}
            </div>
            <button
                onClick={() => handleCreateTask(column.id)}
                className="
                    flex
                    gab-2
                    items-center
                    border-columnBackgroundColor
                    border-2
                    rounded-md
                    p-4
                    border-x-columnBackgroundColor
                    hover:bg-mainBackgroundColor
                    hover:text-cyan-500
                    active:bg-black
                "
            >
                <PlusIcon /> Add task
            </button>
        </div>
    )
}

export default ColumnContainer;
