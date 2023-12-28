import { useEffect, useState } from 'react'
import { noteService } from './note-service/note-service'
import HTMLtoDOCX from 'html-to-docx';
import DOMPurify from 'dompurify';
import { saveAs } from 'file-saver'
import { Button, Collapse, CollapseProps } from 'antd';
import { ClearOutlined, SendOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import './App.scss'
import { Nav } from './navbar/navbar';
import useNotification from 'antd/es/notification/useNotification';

export const App = () => {
  const [userNotes, setUserNotes] = useState<string | ''>('')
  const [generatedNotes, setGeneratedNotes] = useState<string>('')
  const [charCount, setCharCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const [api, contextHolder] = useNotification()

  const charLimit = 12000;

  useEffect(() => {
    //first render
    if (chrome.runtime) {
      const registerActivity = async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        chrome.tabs.connect(tab.id!);
      }
      chrome.storage.local.set({ panelOpen: true })
      registerActivity()
    }

  }, [])

  useEffect(() => {
    setCharCount(userNotes.length)
  }, [userNotes])

  const triggerNotification = (status: string) => {
    if (status === 'success') {
      api.success({
        className: "notification",
        message: "Success!",
        description: "Your organized notes are ready.",
        placement: "bottomRight",
        duration: 5
      })
      setLoading(false)
    }
    if (status === 'error') {
      api.error({
        className: "notification",
        message: "Oops!",
        description: "There was an issue submitting your notes. Please try again.",
        placement: "bottomRight",
        duration: 5
      })
      setLoading(false)
    }
  }

  if (chrome.runtime) {

    chrome.runtime.onMessage.addListener((message: string, _, sendResponse) => {
      if (message) {
        if (userNotes) {
          setUserNotes(userNotes + '\n\n' + message)
        }
        if (!userNotes) {
          setUserNotes(userNotes + message)
        }

        sendResponse({ status: 'success' })
      }
    })

  }

  const submitNotes = async () => {

    setLoading(true)

    try {
      const connection = await noteService(userNotes!)
      const reader = connection?.body?.getReader()

      const processNotes = async () => {
        const { done, value } = await reader!.read()
        if (done) {
          triggerNotification('success')
          return
        }
        const textChunk = new TextDecoder().decode(value)
        setGeneratedNotes(prevValue => prevValue + textChunk)
        processNotes()
      }

      processNotes()
    }

    catch (e) {
      console.error(e)
      triggerNotification('error')
    }

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
    setGeneratedNotes('')
  }

  const input = () => {
    return (
      <div className='noteContainer'>
        <div className="inputContainer">
          <textarea
            className="note noteInput"
            onChange={(e) => { setUserNotes(e.target.value); }}
            value={userNotes}
          />
          <p className={`charCount ${charCount > charLimit ? 'error' : ''}`}>{`${charCount}/${charLimit}`}</p>
        </div>
        <div className="buttonContainer">
          <Button
            className="button clearBtn"
            icon={<ClearOutlined />}
            onClick={clearRawNotes}
            size='small'
          >
            Clear
          </Button>
          <Button
            className="button submitBtn"
            disabled={charCount > charLimit}
            icon={<SendOutlined />}
            loading={loading}
            onClick={submitNotes}
            size='small'
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  const output = () => {
    return (
      <div className='noteContainer'>
        <div
          className="note noteResult"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generatedNotes!) }}
        />
        <div className="buttonContainer">
          <Button
            className="button clearGeneratedBtn"
            icon={<DeleteOutlined />}
            onClick={clearGeneratedNotes}
            size='small'
          >
            Delete
          </Button>
          <Button
            className="button exportBtn"
            icon={<DownloadOutlined />}
            onClick={exportNotesDocX}
            size='small'
          >
            Export
          </Button>
        </div>
      </div>
    )
  }

  const collapseItems: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Input',
      children: input(),
    },
    {
      key: '2',
      label: 'Output',
      children: output(),
    }
  ]

  return (
    <div className="appContainer">
      <Nav />
      <div className="panelContainer">
        {contextHolder}
        <Collapse items={collapseItems} ghost={true} defaultActiveKey={['1', '2']} size='large' />
      </div>
    </div>
  )
}
