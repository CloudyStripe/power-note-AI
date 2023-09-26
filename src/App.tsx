import './app.css'

export const App = () => {
  return (
    <div id="container">
      <h1>Power Note AI</h1>
      <textarea className="note" placeholder="Insert notes..."></textarea>
      <button>Submit</button>
      <textarea className="note" placeholder="Generate notes..."></textarea>
    </div>
  )
}
