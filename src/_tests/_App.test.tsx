import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { EventEmitter } from 'events';
import { App } from '../App'

interface MockStream extends EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [Symbol.asyncIterator](): AsyncIterableIterator<any>;
}

const mockNotes = jest.fn((args: string) => {
    const mockStream = new EventEmitter() as MockStream;

    // Implement the async iterator protocol
    mockStream[Symbol.asyncIterator] = async function* () {

        yield { choices: [{ delta: { content: `${args}` } }] };

        mockStream.emit('end');

    };

    return mockStream;
})

const mockHtmlExport = jest.fn()

jest.mock('../note-service/note-service', () => ({
    generateNotes: (arg: string) => mockNotes(arg)
}))

jest.mock('file-saver', () => ({
    saveAs: jest.fn()
}))

jest.mock('antd', () => {
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
        jest.fn()
    ]);
});


jest.mock('html-to-docx', () => (() => mockHtmlExport()))

describe('App', () => {

    const injectKey = async () => {

        const settingsEl = document.querySelector('.settingsIcon')
        
        act(() => {
            fireEvent.click(settingsEl!)
        })

        const keyHeaderEl = document.querySelector('.keyHeader div')

        act(() => {
            fireEvent.click(keyHeaderEl!)
        })

        const keyInput = document.querySelector('.keyInput input')

        act(() => {
            fireEvent.change(keyInput!, { target: { value: 'test' } })
        })
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('renders without crashing', () => {

        renderComponent()


        const el = document.querySelector('.panelContainer')
        expect(el).not.toBeNull()
    })

    it('submit buttons calls service', async () => {

        renderComponent()
        await injectKey()

        const noteInput = document.querySelector('.noteInput')
        const submitBtn = document.querySelector('.submitBtn')

        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' } })
        fireEvent.click(submitBtn!)

        expect(mockNotes).toHaveBeenCalledWith('Hello, World!')
    })

    it('export button calls export docx function', async () => {

        renderComponent()
        await injectKey()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')
        const exportBtn = document.querySelector('.exportBtn')


        fireEvent.change(noteInput!, { target: { value: '<p>Hello, World!</p>' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('<p>Hello, World!</p>')
        })

        fireEvent.click(exportBtn!);

        expect(mockHtmlExport).toHaveBeenCalled()
    })

    it('clear input button clears inputs', () => {

        renderComponent()

        const textInput = document.querySelector('.noteInput')
        const clearBtn = document.querySelector('.clearBtn')

        fireEvent.change(textInput!, { target: { value: '<p>Hello, World!</p>' } })
        fireEvent.click(clearBtn!)

        expect(textInput!.innerHTML).toBe('')
    })

    it('clear generated notes button clears generated notes', async () => {
        renderComponent()
        await injectKey()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')
        const clearBtn = document.querySelector('.clearGeneratedBtn')


        fireEvent.change(noteInput!, { target: { value: '<p>Hello, World!</p>' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('<p>Hello, World!</p>')
        })

        fireEvent.click(clearBtn!)
        expect(noteResult?.innerHTML).toEqual('')

    })

    it('successful generation pops success notification', async () => {

        renderComponent()
        await injectKey()

        const noteInput = document.querySelector('.noteInput')
        const noteResult = document.querySelector('.noteResult')
        const submitBtn = document.querySelector('.submitBtn')


        fireEvent.change(noteInput!, { target: { value: '<p>Hello, World!</p>' } })
        fireEvent.click(submitBtn!);

        await waitFor(() => {
            expect(mockSuccess).toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(noteResult?.innerHTML).toEqual('<p>Hello, World!</p>')
        })

    })

    it('failed generation pops failure notification', async () => {

        renderComponent()

        mockNotes.mockImplementationOnce(() => {
            throw new Error('Error')
        });

        const noteInput = document.querySelector('.noteInput')
        const submitBtn = document.querySelector('.submitBtn')

        fireEvent.change(noteInput!, { target: { value: '<p>Hello, World!</p>' } })
        fireEvent.click(submitBtn!);


        await waitFor(() => {
            expect(mockError).toHaveBeenCalled()
        })

    })

    it('toggle collapse hides content', async () => {


        renderComponent()

        const collapseArrow = document.querySelector('.ant-collapse-header')
        const noteInputContainer = document.querySelector('.ant-collapse-content')

        fireEvent.click(collapseArrow!);

        const noteStyle = window.getComputedStyle(noteInputContainer!)

        await waitFor(() => {
            expect(noteStyle.display).toBe('none')
        })

    })

    it('toggle collapse again reveals content', async () => {


        renderComponent()

        const collapseArrow = document.querySelector('.ant-collapse-header')
        const noteInputContainer = document.querySelector('.ant-collapse-content')

        fireEvent.click(collapseArrow!);
        fireEvent.click(collapseArrow!);

        const noteStyle = window.getComputedStyle(noteInputContainer!)

        await waitFor(() => {
            expect(noteStyle.display).not.toBe('none')
        })

    })
})

const renderComponent = () => {
    return render(
        <App />
    )
}