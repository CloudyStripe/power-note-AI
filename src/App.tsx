import { useEffect, useState } from 'react'
import './app.scss'

export const App = () => {


  const [userNotes, setUserNotes] = useState<string | null>(null)
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null)

  const submitNotes = async () => {
    const connection = await fetch('http://localhost:3001/organize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes: userNotes })
    })
    const reader = connection?.body?.getReader()

    const processNotes = async () => {
      const { done, value } = await reader!.read()
      if (done){
        return
      }
      const textChunk = new TextDecoder().decode(value)
      setGeneratedNotes(prevValue => prevValue + textChunk)
      processNotes()
    }

    processNotes()
  }

  return (
    <div id="container">
      <h1>Power Note AI</h1>
      <textarea
        className="note"
        onChange={(e) => { setUserNotes(e.target.value) }}
        placeholder="Insert notes..."></textarea>
      <button onClick={() => submitNotes()}>Submit</button>
      <textarea className="note" placeholder="Generate notes..."></textarea>
      <div dangerouslySetInnerHTML={{ __html: generatedNotes! }}></div>
    </div>
  )
}
