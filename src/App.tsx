import { useState } from 'react'
import { noteService } from './note-service/note-service'
import HTMLtoDOCX from 'html-to-docx';
import DOMPurify from 'dompurify';
import { saveAs } from 'file-saver'
import { Button } from 'antd';
import { ClearOutlined, SendOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { savedPage } from './utils/types/form-types';
import './App.scss'
import { Nav } from './navbar/navbar';

export const App = () => {

  const [currentPage, setCurrentPage] = useState(0)
  const [userNotes, setUserNotes] = useState<string | ''>('')
  const [generatedNotes, setGeneratedNotes] = useState<string>('')
  const [noteCatalog, setNoteCatalog] = useState<savedPage[] | []>([])
  const [loading, setLoading] = useState<boolean>(false)

  if (chrome.runtime) {
    chrome.runtime.onMessage.addListener((message: string, _, sendResponse) => {
      if (message) {
        if(userNotes){
          setUserNotes(userNotes + '\n\n' + message)
        }
        if(!userNotes){
          setUserNotes(userNotes + message)
        }

        sendResponse({ status: 'success' })
      }
    })
  }
  const submitNotes = async () => {
    setLoading(true)
    const connection = await noteService(userNotes!)
    const reader = connection?.body?.getReader()

    const processNotes = async () => {
      const { done, value } = await reader!.read()
      if (done) {
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
    if (generatedNotes) {
      const docXBlob = await HTMLtoDOCX(generatedNotes)
      saveAs(docXBlob, 'notes.docx')
    }
    if (!generatedNotes) {
      console.log('No notes to export')
    }
  }

  const clearRawNotes = () => {
    setUserNotes('')
  }

  const clearGeneratedNotes = () => {

    if (noteCatalog.length >= 1) {
      const updatedCatalog = noteCatalog.filter(x => x.page !== (currentPage - 1))
      setNoteCatalog(updatedCatalog)
      setGeneratedNotes('')

      updatedCatalog.length === 0 ? setCurrentPage(1) : setCurrentPage(noteCatalog.length)
    }

    if (noteCatalog.length === 0) {
      setGeneratedNotes('')
      setCurrentPage(1)
    }
  }

  return (
    <div>
      <Nav/>
      <div className="panelContainer">
        <textarea
          className="note noteInput"
          onChange={(e) => { setUserNotes(e.target.value); }}
          value={userNotes}
          placeholder="Insert notes...">
        </textarea>
        <div className="buttonContainer">
          <Button
            className="button clearBtn"
            icon={<ClearOutlined />}
            onClick={clearRawNotes}
          >
            Clear
          </Button>
          <Button
            className="button submitBtn"
            icon={<SendOutlined />}
            loading={loading}
            onClick={submitNotes}
          >
            Submit
          </Button>
        </div>
        <div
          className="note noteResult"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generatedNotes!) }}
          placeholder="Generate notes..." />
        <div className="buttonContainer">
          <Button
            className="button clearGeneratedBtn"
            icon={<DeleteOutlined />}
            onClick={clearGeneratedNotes}
          >
            Delete
          </Button>
          <Button
            className="button exportBtn"
            icon={<DownloadOutlined />}
            onClick={exportNotesDocX}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
