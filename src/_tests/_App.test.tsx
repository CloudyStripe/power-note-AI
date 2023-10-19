import { fireEvent, render } from '@testing-library/react'
import { App } from '../App'

const mockNotes = jest.fn((arg: string) => ({
    body: {
        getReader: () => ({
            read: () => ({
                done: true,
                value: arg
            })
        })
    }
}))

jest.mock('../note-service/note-service', () => ({
    noteService: (arg: string) => mockNotes(arg)
}))

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

        fireEvent.change(noteInput!, { target: { value: 'Hello, World!' }})
        fireEvent.click(submitBtn!)

        expect(mockNotes).toHaveBeenCalledWith('Hello, World!')
    })

    it('clearButton clears user notes', () => {
        
        renderComponent()

        const textInput = document.querySelector('.noteInput')
        const clearBtn = document.querySelector('.clearBtn')

        fireEvent.change(textInput!, { target: { value: 'Hello, World!' }})
        fireEvent.click(clearBtn!)

        expect(textInput!.innerHTML).toBe('')
    })
})

const renderComponent = () => {
    return render(
        <App/>
    )
}