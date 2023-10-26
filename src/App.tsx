import { useState } from 'react'
import { noteService } from './note-service/note-service' 
import HTMLtoDOCX from 'html-to-docx';
import { saveAs } from 'file-saver'
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

  const exportNotesDocX = async () => {
    if(generatedNotes){
      const docXBlob = await HTMLtoDOCX(generatedNotes)
      saveAs(docXBlob, 'notes.docx')
    }
    if(!generatedNotes){
      console.log('No notes to export')
    }
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
        <button className="button" onClick={clearNotes}>Clear</button>
        <button className="button" onClick={submitNotes}>Submit</button>
      </div>
      <div 
        className="note noteResult" 
        dangerouslySetInnerHTML={{ __html: generatedNotes! }} 
        placeholder="Generate notes..."
        contentEditable={true}
      />
      <div className="buttonContainer">
        <button className="button" onClick={exportNotesDocX}>Export DocX</button>
        <button className="button">Export Google Docs</button>
      </div>
    </div>
  )
}
