import { useEffect, useRef, useState } from "react"
import './App.scss'

export const App = () => {

    const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const submitButton = buttonRef.current

    const changeHighlightColor = () => {
        const style = document.createElement('style');
        style.innerHTML = `::selection { background: yellow; color: black; }`;
        document.head.appendChild(style);
    };

    const handleSubmit = (event: MouseEvent) => {
        console.log('Submitted')
        console.log(event)
    }

    const handleMouseUp = (event: MouseEvent) => {

        const selection = window.getSelection();

        if(selection?.isCollapsed){
            //This handles the edge case where the user performs a right-click outside the currently highlighted text, resulting in the collapse of the active text selection.
            setOpen(false)
            return
        }

        if (event.button === 2) {
            return
        }

        if (selection && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            let top = rect.bottom + window.scrollY;
            let left = rect.left + window.scrollX;

            const dialogWidth = 300;
            const dialogHeight = 200;

            if (left + dialogWidth > window.innerWidth) {
                left = window.innerWidth - dialogWidth;
            }

            if (top + dialogHeight > window.innerHeight + window.scrollY) {
                top = window.innerHeight + window.scrollY - dialogHeight;
            }

            setDialogPosition({ top: top, left: left });

            setOpen(true);

        } else {
            setOpen(false);

        }
    };

    const handleMouseDown = (event: MouseEvent) => {

        const selection = window.getSelection();
        const clickedElement = event.target as HTMLElement

        if (event.button === 2) {
            return
        }

        if (selection && !selection.isCollapsed) {
            if (buttonRef && !buttonRef.current?.contains(clickedElement)) {
                selection.removeAllRanges();
                setOpen(false);
            }
        }

    };


   useEffect(() => {

    changeHighlightColor();

    if (submitButton && open) {
        submitButton.addEventListener('click', handleSubmit);
    }
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

   }, [])


    return open && (
        <div className="submitButtonContainer">
            <button ref={buttonRef} className="submitButton" style={{ top: `${dialogPosition.top}px`, left: `${dialogPosition.left}px` }}>Submit</button>
        </div>
    )
}