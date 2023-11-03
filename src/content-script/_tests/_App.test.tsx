import { fireEvent, render } from '@testing-library/react'
import { App } from '../App'

describe('Content Script', () => {

    it('submit button renders', () => {

        renderComponent()

        const text = 'Some text to select';
        const p = document.createElement('p');

        p.textContent = text;
        document.body.appendChild(p);

        const range = document.createRange()
        range.selectNodeContents(p)

        const selection = window.getSelection()
        selection?.addRange(range)

        fireEvent.mouseUp(p)

        const submitButton = document.querySelector('.submitButton')
        expect(submitButton).toBeTruthy()

    })

    it('submit button unmounts on subsequent click', async () => {

        renderComponent()

        const text = 'Some text to select';
        const p = document.createElement('p');
        const span = document.createElement('span')

        p.textContent = text;
        document.body.appendChild(p);
        document.body.appendChild(span)

        const range = document.createRange()
        range.selectNodeContents(p)

        const selection = window.getSelection()
        selection?.addRange(range)

        fireEvent.mouseUp(p)

        const submitButton = document.querySelector('.submitButton')
        expect(submitButton).toBeTruthy()

        selection?.collapseToStart()

        fireEvent.mouseUp(p)

        const updatedSubmitButton = document.querySelector('.submitButton')

        expect(updatedSubmitButton).toBeFalsy()

    })

})

const renderComponent = () => {
    return render(
        <App />
    )
}