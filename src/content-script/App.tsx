import { useEffect, useRef, useState } from "react"
import './App.scss'

export const App = () => {

    const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const changeHighlightColor = () => {
            const style = document.createElement('style');
            style.innerHTML = `::selection { background: yellow; }`;
            document.head.appendChild(style);
        };

        changeHighlightColor();

        const handleMouseUp = () => {

            const selection = window.getSelection();
            
            if (selection && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setDialogPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                });
                setOpen(true);
            } else {
                setOpen(false);
            }
        };

        const handleMouseDown = () => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                selection.removeAllRanges();
                setOpen(false);
            }
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);

    }, [])

    return open && (
        <div className="container" ref={containerRef} style={{top: `${dialogPosition.top}px`, left: '${dialogPosition.left}px`'}}>Submit</div>
    )
}