import { useEffect, useRef, useState } from "react"
import { Button, Card } from "antd";
import './App.scss'

export const App = () => {

    const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
    const [open, setOpen] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string>('');
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    let styleEl: HTMLStyleElement | null = null

    const changeHighlightColor = () => {
        styleEl = document.createElement('style');
        styleEl.innerHTML = `::selection { background: yellow; color: black; }`;
        document.head.appendChild(styleEl);
    };

    const removeHighlightColor = () => {
        if (styleEl) {
            document.head.removeChild(styleEl);
            styleEl = null;
        }
    };

    const addListeners = () => {
        changeHighlightColor();
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const removeListeners = () => {
        setOpen(false)
        removeHighlightColor()
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    chrome.runtime.onConnect.addListener((port) => {
        if(styleEl === null){
            addListeners()
        }

        port.onDisconnect.addListener(() => {
            chrome.storage.local.set({ panelOpen: false })
            removeListeners()
        })
    })

    chrome.storage.onChanged.addListener((changes) => {
        if(changes.panelOpen.newValue == false){
            removeListeners()
        }
        if(changes.panelOpen.newValue == true){
            addListeners()
        }
    })

    const handleSubmit = async () => {
        try {
            await chrome.runtime.sendMessage(selectedText)
        }

        catch {
            console.log('Error. Please try again.')
        }
    }

    const handleMouseUp = (event: MouseEvent) => {

        const selection = window.getSelection();

        if (selection?.isCollapsed) {
            //This handles the edge case where the user performs a right-click outside the currently highlighted text, resulting in the collapse of the active text selection.
            setOpen(false)
            return
        }

        if (event.button === 2) {
            return
        }

        if (selection && !selection.isCollapsed) {

            setSelectedText(selection.toString())

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

        const checkPanel = async () => {

            const panelStatus = await chrome.storage.local.get(['panelOpen'])

            if (styleEl === null && panelStatus.panelOpen === true) {
                addListeners()
            }

            if (panelStatus.panelOpen === false) {
                removeListeners()
            }
            
        }

        checkPanel()
    }, [])



    useEffect(() => {

        const currentButton = buttonRef.current;

        if (open && currentButton) {
            currentButton.addEventListener('click', handleSubmit)
        }

        if (!open && currentButton) {
            currentButton.removeEventListener('click', handleSubmit)
        }

        return () => {
            if (currentButton) {
                currentButton.removeEventListener('click', handleSubmit);
            }
        };
    }, [open])


    return open && (
        <Card className="submitButtonContainer" style={{ top: `${dialogPosition.top}px`, left: `${dialogPosition.left}px` }}>
            <Button ref={buttonRef} className="submitButton">Submit</Button>
        </Card>
    )
}