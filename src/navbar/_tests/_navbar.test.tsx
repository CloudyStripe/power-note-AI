import { render } from '@testing-library/react'
import { Nav } from "../navbar"

describe('navbar', () => {

    beforeAll(jest.clearAllMocks);

    it('nav successfully renders', () => {
        renderComponent()

        const el = document.querySelector('.navContainer')

        expect(el).toBeTruthy()
    })
})

const renderComponent = () => {
    return render(
        <Nav />
    )
}