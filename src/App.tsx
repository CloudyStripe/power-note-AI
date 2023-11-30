import { useState } from 'react'
import { noteService } from './note-service/note-service'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import HTMLtoDOCX from 'html-to-docx';
import DOMPurify from 'dompurify';
import { saveAs } from 'file-saver'
import { Button, Divider, Pagination } from 'antd';
import { ClearOutlined, SendOutlined, FileWordOutlined, GoogleOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons'
import './App.scss'
import { savedPage } from './utils/types/form-types';

export const App = () => {

  const [currentPage, setCurrentPage] = useState(0)
  const [userNotes, setUserNotes] = useState<string | ''>('')
  const [generatedNotes, setGeneratedNotes] = useState<string>('')
  const [noteCatalog, setNoteCatalog] = useState<savedPage[] | []>([])
  const [loading, setLoading] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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

  const handleSave = (note: string) => {

    setNoteCatalog(prevValue => {

      const updatedArray = [...prevValue, { notes: note, page: noteCatalog.length }]
      setCurrentPage(updatedArray.length + 1)

      return updatedArray

    })
    setGeneratedNotes('')

  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Adjust for zero-based indexing
    setGeneratedNotes(noteCatalog[page - 1]?.notes || '');
  }

  console.log((noteCatalog.length !== 1 && (currentPage !== noteCatalog.length - 1 && generatedNotes != '')))

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
        placeholder="Generate notes..."
      />
      <div className="buttonContainer">
        <Button
          className="button clearGeneratedBtn"
          icon={<DeleteOutlined />}
          onClick={clearGeneratedNotes}
        >
          Delete
        </Button>
        <Button
          className="button savePageBtn"
          icon={<SaveOutlined />}
          onClick={() => handleSave(generatedNotes)}
        >
          Save
        </Button>
      </div>
      <Pagination
        hideOnSinglePage
        className="pageContainer"
        current={currentPage}
        onChange={(page => handlePageChange(page))}
        pageSize={1}
        showLessItems={true}
        total={noteCatalog.length + 1}
      />
      <div className="exportContainer">
        <Divider className="divider">Export</Divider>
        <div className="buttonContainer">
          <Button
            className="button docXBtn"
            icon={<FileWordOutlined />}
            onClick={exportNotesDocX}
          >
            DocX
          </Button>
          <Button
            className="button"
            icon={<GoogleOutlined />}
          >
            Google Docs
          </Button>
        </div>
      </div>
    </div>
  )
}
