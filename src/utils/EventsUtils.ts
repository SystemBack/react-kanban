import { SyntheticEvent } from "react";

const setFocusOnEnd = (e: Event) => {
    const target: HTMLTextAreaElement | HTMLInputElement | null  = e.target

    target?.setSelectionRange(target?.value.length, target?.value.length);
}

export const FocusEventUtil = () => {
    return {
        setFocusOnEnd
    }
}