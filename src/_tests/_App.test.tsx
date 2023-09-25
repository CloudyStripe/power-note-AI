import { render } from '@testing-library/react'
import { App } from '../App'

describe('App', () => {
    it('renders without crashing', () => {

        renderComponent()

        const el = document.getElementById('container')
        expect(el).not.toBeNull()
    })
})

const renderComponent = () => {
    return render(
        <App/>
    )
}