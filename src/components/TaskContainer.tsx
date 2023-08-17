import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { FocusEventUtil } from "../utils/EventsUtils";
import { ENTER_KEY_TEXT } from "../utils/constants";
import DeleteButton from "./DeleteButton";

interface Props {
    task: Task;
    handleDeleteTask: (id: Id) => void;
    handleChangeTask: (id: Id, content: string) => void;
}

function TaskContainer(props: Props) {
    const { task, handleDeleteTask, handleChangeTask } = props
    const { setFocusOnEnd } = FocusEventUtil();
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleToggleEditMode = () => {
        setIsEditMode((isEdit) => !isEdit);
        setIsMouseOver(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== ENTER_KEY_TEXT) return;

        setIsEditMode(false);
    }

    const showDeleteButton = () => {
        return (
            <button
            onClick={() => handleDeleteTask(task.id)}
            className="
                strike-white
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                bg-mainBackgroundColor
                hover:bg-columnBackgroundColor
                p-2
                rounded-xl
                opacity-60
                hover:opacity-100
                hover:text-red-400
            ">
                <TrashIcon />
            </button>
        )
    }

    const createTaskTextArea = (task: Task) => {
        return (
            <div
            className="
                bg-mainBackgroundColor
                p-2.5
                m-1
                h-[100px]
                min-h-[100px]
                items-center
                flex
                text-left
                rounded-xl
                hover:ring-2
                hover:ring-inset
                hover:ring-cyan-500
                cursor-grab
                relative
            ">
                <textarea
                    autoFocus
                    onFocus={(e) => setFocusOnEnd(e)}
                    value={task.content}
                    onBlur={handleToggleEditMode}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleChangeTask(task.id, e.target.value)}
                    className="
                        h-[90%]
                        w-full
                        resize-none
                        border-none
                        rounded
                        bg-transparent
                        text-white
                        focus:outline-none
                    ">
                </textarea>
            </div>
        )
    }

    if (isEditMode) return createTaskTextArea(task);

    return (
        <div
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
        onClick={handleToggleEditMode}
        className="
            bg-mainBackgroundColor
            p-2.5
            m-1
            h-[100px]
            min-h-[100px]
            items-center
            flex
            text-left
            rounded-xl
            hover:ring-2
            hover:ring-inset
            hover:ring-cyan-500
            cursor-grab
            relative
        ">
        {task.content}
        {isMouseOver && showDeleteButton()}
        </div>
    )
}

export default TaskContainer;
