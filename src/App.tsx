import { useEffect, useState } from 'react';
import { generateNotes } from './note-service/note-service';
import HTMLtoDOCX from 'html-to-docx';
import DOMPurify from 'dompurify';
import { saveAs } from 'file-saver';
import { Button, Collapse, CollapseProps } from 'antd';
import { ClearOutlined, SendOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { Nav } from './navbar/navbar';
import useNotification from 'antd/es/notification/useNotification';
import { WritableStream } from 'htmlparser2/lib/WritableStream';
import './App.scss';
import { Outcome } from './utils/types/enums';

export const App = () => {
  const [openAiKey, setOpenAiKey] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [api, contextHolder] = useNotification();

  const charLimit = 12000;

  const noteSetter = (newValue: string) => {
    setGeneratedNotes(prevValue => prevValue + newValue)
  }

  useEffect(() => {
    if (chrome.runtime) {
      const registerActivity = async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
        chrome.tabs.connect(tab.id!);
      }
      chrome.storage.local.set({ panelOpen: true })
      registerActivity()
    }
  }, [])

  useEffect(() => {
    setCharCount(userNotes.length)
  }, [userNotes])

  const triggerNotification = (status: string, summary?: string) => {
    const notificationConfig = {
      className: "notification",
      message: status === Outcome.Success ? "Success!" : "Oops!",
      description: status === Outcome.Success
        ? "Your organized notes are ready."
        : summary || "There was an issue submitting your notes. Please try again.",
      placement: "bottomRight" as const,
      duration: 5
    }

    status === Outcome.Success ? api.success(notificationConfig) : api.error(notificationConfig)
    setLoading(false)
  }

  if (chrome.runtime) {
    chrome.runtime.onMessage.addListener((message: string, _, sendResponse) => {
      if (message) {
        setUserNotes(prev => prev ? `${prev}\n\n${message}` : message)
        sendResponse({ status: Outcome.Success })
      }
    })
  }

  const submitNotes = async () => {
    setLoading(true)

    if (!openAiKey) {
      triggerNotification(Outcome.Error, 'Please add an Open AI api key.')
    } else if (charCount > charLimit) {
      triggerNotification(Outcome.Error, 'Input is too large. Please reduce the size of your notes and try again.')
    } else if (!userNotes) {
      triggerNotification(Outcome.Error, 'There are no notes to submit. Please add notes and try again.')
    } else {
      try {
        const response = await generateNotes(userNotes, openAiKey)
        let buffer = ''

        const parserStream = new WritableStream({
          onclosetag() {
            noteSetter(buffer)
            buffer = ''
          },
        })

        for await (const note of response) {
          const chunk = note.choices[0].delta.content
          if (chunk) {
            buffer += chunk
            parserStream.write(chunk)
          }
        }

        triggerNotification(Outcome.Success)
      } catch (e: any) {
        triggerNotification(
          Outcome.Error,
          e.message === 'Access Denied'
            ? "There was an issue submitting your notes. Please ensure your Open AI api key is correct in settings."
            : undefined
        )
      }
    }
  }

  const exportNotesDocX = async () => {
    if (generatedNotes) {
      const docXBlob = await HTMLtoDOCX(generatedNotes)
      saveAs(docXBlob, 'notes.docx')
    } else {
      console.log('No notes to export')
    }
  }

  const input = () => (
    <div className='noteContainer'>
      <div className="inputContainer">
        <textarea
          className="note noteInput"
          onChange={(e) => setUserNotes(e.target.value)}
          value={userNotes}
        />
        <p className={`charCount ${charCount > charLimit ? 'error' : ''}`}>{`${charCount}/${charLimit}`}</p>
      </div>
      <div className="buttonContainer">
        <Button
          className="button clearBtn"
          icon={<ClearOutlined />}
          onClick={() => setUserNotes('')}
          size='small'
        >
          Clear
        </Button>
        <Button
          className="button submitBtn"
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

  const output = () => (
    <div className='noteContainer'>
      <div
        className="note noteResult"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generatedNotes) }}
      />
      <div className="buttonContainer">
        <Button
          className="button clearGeneratedBtn"
          icon={<DeleteOutlined />}
          onClick={() => setGeneratedNotes('')}
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
      <Nav keySetter={setOpenAiKey} />
      <div className="panelContainer">
        {contextHolder}
        {!openAiKey && (
          <h4 className="keyWarning">Please open settings and add your Open AI api key</h4>
        )}
        <Collapse items={collapseItems} ghost defaultActiveKey={['1', '2']} size='large' />
      </div>
    </div>
  )
}
