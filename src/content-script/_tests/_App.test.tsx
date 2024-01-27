import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { App } from '../App'

describe('Content Script', () => {

    beforeEach(() => jest.clearAllMocks())

    it('submit button renders', async () => {

        await act(async () => {
            renderComponent();
        });

        const text = 'Some text to select';
        const p = document.createElement('p');

        p.textContent = text;
        document.body.appendChild(p);

        const range = document.createRange()
        range.selectNodeContents(p)

        const selection = window.getSelection()
        selection?.addRange(range)

        await act(() => fireEvent.mouseUp(p))

        const submitButton = document.querySelector('.submitButton')
        await waitFor(() => expect(submitButton).toBeTruthy())

    })

    it('submit button unmounts on subsequent click', async () => {

        await act(async () => {
            renderComponent();
        });

        const text = 'Some text to select';
        const p = document.createElement('p');
        const span = document.createElement('span')

        p.textContent = text;
        document.body.appendChild(p);

        const range = document.createRange()
        range.selectNodeContents(p)

        const selection = window.getSelection()
        selection?.addRange(range)

        fireEvent.mouseUp(p)

        const submitButton = document.querySelector('.submitButton')
        expect(submitButton).toBeTruthy()

        await act(() => fireEvent.mouseDown(p))

        const updatedSubmitButton = document.querySelector('.submitButton')

        await waitFor(() => expect(updatedSubmitButton).toBeFalsy())

    })

})

const renderComponent = () => {
    return render(
        <App />
    )
}