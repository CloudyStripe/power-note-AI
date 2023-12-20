import { fireEvent, render, waitFor } from '@testing-library/react'
import { Nav } from "../navbar"

describe('navbar', () => {

    beforeAll(jest.clearAllMocks);

    it('nav successfully renders', () => {
        renderComponent()

        const el = document.querySelector('.navContainer')

        expect(el).toBeTruthy()
    })

    it('settings icon opens settings modal', () => {
        renderComponent()

        const settings = document.querySelector('.settingsIcon')

        fireEvent.click(settings!)

        const modal = document.querySelector('.settingsModal')

        expect(modal).toBeTruthy()
    })

    it('user closes modal', () => {
        renderComponent()

        const settings = document.querySelector('.settingsIcon')

        fireEvent.click(settings!)

        const modal = document.querySelector('.settingsModal')

        expect(modal).toBeTruthy()

        const closeButton = document.querySelector('.ant-modal-close')

        fireEvent.click(closeButton!)

        waitFor(() => expect(modal).toBeFalsy())
    })
})

const renderComponent = () => {
    return render(
        <Nav />
    )
}