import { fireEvent, render, waitFor } from '@testing-library/react'
import { App } from '../App'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockNotes: any = jest.fn((arg: string) => {

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

jest.mock('antd', () =>{
    const antd = jest.requireActual('antd')

    return {
        ...antd,
        Pagination: () => <div className="pageContainer"></div>
    }
})

const mockSuccess = jest.fn();
const mockError = jest.fn();

jest.mock('antd/es/notification/useNotification', () => {
    return jest.fn(() => [
        { success: () => mockSuccess(), error: () => mockError() },
        jest.fn() // Mock contextHolder
      ]);    
});


jest.mock('html-to-docx', () => (() => mockHtmlExport()))

describe('App', () => {

    beforeEach(() => jest.clearAllMocks())
    it('renders without crashing', () => {

        renderComponent()

        const el = document.querySelector('.panelContainer')
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

    it('export button calls export docx function', async () => {

        renderComponent()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')
        const exportBtn = document.querySelector('.exportBtn')


        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('Hello, World!')
        })

        fireEvent.click(exportBtn!);

        expect(mockHtmlExport).toHaveBeenCalled()
    })

    it('clear input button clears inputs', () => {

        renderComponent()

        const textInput = document.querySelector('.noteInput')
        const clearBtn = document.querySelector('.clearBtn')

        fireEvent.change(textInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(clearBtn!)

        expect(textInput!.innerHTML).toBe('')
    })

    it('clear generated notes button clears generated notes', async () => {
        renderComponent()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')
        const clearBtn = document.querySelector('.clearGeneratedBtn')


        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('Hello, World!')
        })

        fireEvent.click(clearBtn!)
        expect(noteResult?.innerHTML).toEqual('')

    })

    it('successful generation pops success notification', async () => {

        renderComponent()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')


        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(mockSuccess).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('Hello, World!')
        })

    })

    it('failed generation pops failure notification', async () => {
        

        renderComponent()

        mockNotes.mockImplementationOnce(() => {
            return Promise.reject(new Error('Mock error'));
        });

        const noteInput = document.querySelector('.noteInput')
        const submitBtn = document.querySelector('.submitBtn')

        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!);

        
        await waitFor(() => {
            expect(mockError).toHaveBeenCalled()
        })
        
    })
})

const renderComponent = () => {
    return render(
        <App />
    )
}