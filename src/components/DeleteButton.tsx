import TrashIcon from "../icons/TrashIcon";
import { Id } from "../types";

interface Props {
    id: Id
    handleClickAction: (id: Id) => void;
    customClasses: string
}

function DeleteButton(props: Props) {
    const { id, handleClickAction } = props
    return (
        <button
            onClick={() => (handleClickAction(id))}
            className="
                stroke-gray-500
                hover:stroke-white
                hover:bg-columnBackgroundColor
                rounded-xl
                p-2
                opacity-60
                hover:opacity-100
                hover:text-red-400
            ">
            <TrashIcon />
        </button>
    )
}

export default DeleteButton;
