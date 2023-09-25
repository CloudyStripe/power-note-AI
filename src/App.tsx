import './app.css'

export const App = () => {
  return (
    <div id="container">
      <h1>Power Note AI</h1>
      <textarea id="raw_note" placeholder="Insert notes..."></textarea>
      <button>Submit</button>
      <textarea id="organized_note" placeholder="Insert notes..."></textarea>
    </div>
  )
}
