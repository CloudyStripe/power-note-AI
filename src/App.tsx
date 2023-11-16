import { useState } from 'react'
import { noteService } from './note-service/note-service'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import HTMLtoDOCX from 'html-to-docx';
import { saveAs } from 'file-saver'
import { Button } from 'antd';
import { ClearOutlined, SendOutlined, FileWordOutlined, GoogleOutlined } from '@ant-design/icons'
import './App.scss'

export const App = () => {

  const [userNotes, setUserNotes] = useState<string | ''>('')
  const [generatedNotes, setGeneratedNotes] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chrome.runtime.onMessage.addListener((message: string, _, sendResponse) => {
    if(message){
      setUserNotes(userNotes + '\n\n' + message)
      sendResponse({status: 'success'})
    }
  }) 

  const submitNotes = async () => {
    setLoading(true)
    const connection = await noteService(userNotes!)
    const reader = connection?.body?.getReader()

    const processNotes = async () => {
      const { done, value } = await reader!.read()
      if (done){
        setLoading(false)
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
    <div className="panelContainer">
      <img className="header" src="/images/header-dark.png"></img>
      <textarea
        className="note noteInput"
        onChange={(e) => { setUserNotes(e.target.value) }}
        value={userNotes}
        placeholder="Insert notes...">
      </textarea>
      <div className="buttonContainer">
        <Button 
          className="button clearBtn"
          icon={<ClearOutlined />}
          onClick={clearNotes} 
          size="large"
        >
          Clear
        </Button>
        <Button 
          className="button submitBtn" 
          icon={<SendOutlined />}
          loading={loading}
          onClick={submitNotes} size="large"
          >
            Submit
        </Button>
      </div>
      <div 
        className="note noteResult" 
        dangerouslySetInnerHTML={{ __html: generatedNotes! }} 
        placeholder="Generate notes..."
      />
      <div className="buttonContainer">
        <Button 
          className="button docXBtn" 
          icon={<FileWordOutlined />}
          onClick={exportNotesDocX} 
          size="large"
        >
        Export DocX
        </Button>
        <Button 
          className="button" 
          icon={<GoogleOutlined />}
          size="large"
        >
        Export Google Docs
        </Button>
      </div>
    </div>
  )
}
