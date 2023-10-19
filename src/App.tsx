import { useState } from 'react'
import { noteService } from './note-service/note-service'
import './app.scss'

export const App = () => {

  const [userNotes, setUserNotes] = useState<string | ''>('')
  const [generatedNotes, setGeneratedNotes] = useState<string>('')

  const submitNotes = async () => {
    const connection = await noteService(userNotes!)
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

  const clearNotes = () => {
    setUserNotes('')
  }

  return (
    <div className="container">
      <h1 className="header">Power Note AI</h1>
      <textarea
        className="note noteInput"
        onChange={(e) => { setUserNotes(e.target.value) }}
        value={userNotes}
        placeholder="Insert notes...">
      </textarea>
      <div className="buttonContainer">
        <button className="clearBtn" onClick={() => clearNotes()}>Clear</button>
        <button className="submitBtn" onClick={() => submitNotes()}>Submit</button>
      </div>
      <div 
        className="note noteResult" 
        dangerouslySetInnerHTML={{ __html: generatedNotes! }} 
        placeholder="Generate notes..."
        contentEditable={true}
      />
    </div>
  )
}
