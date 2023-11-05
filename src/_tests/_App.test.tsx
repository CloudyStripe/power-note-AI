import { fireEvent, render, waitFor } from '@testing-library/react'
import { App } from '../App'

const mockNotes = jest.fn((arg: string) => {

    const textEncoder = new TextEncoder();
    const argBytes = textEncoder.encode(arg);
    let isFirstCall = true;

    return {
        body: {
            getReader: () => ({
                read: () => {
                    const done = !isFirstCall;
                    isFirstCall = false;

                    return {
                        done: done,
                        value: argBytes
                    };
                },
            }),
        },
    };
});

const mockHtmlExport = jest.fn()

jest.mock('../note-service/note-service', () => ({
    noteService: (arg: string) => mockNotes(arg)
}))

jest.mock('file-saver', () => ({
    saveAs: jest.fn()
}))

jest.mock('html-to-docx', () => (() => mockHtmlExport()))

describe('App', () => {

    beforeEach(() => jest.clearAllMocks())
    it('renders without crashing', () => {

        renderComponent()

        const el = document.querySelector('.container')
        expect(el).not.toBeNull()
    })

    it('submit buttons calls service', () => {

        renderComponent()

        const noteInput = document.querySelector('.noteInput')
        const submitBtn = document.querySelector('.submitBtn')

        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!)

        expect(mockNotes).toHaveBeenCalledWith('Hello, World!')
    })

    it('export docx button calls export docx functions', async () => {

        renderComponent()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')
        const exportBtn = document.querySelector('.docXBtn')


        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('Hello, World!')
        })

        fireEvent.click(exportBtn!);

        expect(mockHtmlExport).toHaveBeenCalled()
    })

    it('clear button clears inputs', () => {

        renderComponent()

        const textInput = document.querySelector('.noteInput')
        const clearBtn = document.querySelector('.clearBtn')

        fireEvent.change(textInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(clearBtn!)

        expect(textInput!.innerHTML).toBe('')
    })
})

const renderComponent = () => {
    return render(
        <App />
    )
}