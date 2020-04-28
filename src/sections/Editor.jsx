import React from 'react'
import Editor from '@monaco-editor/react'

import { Error, EditorWrapper } from '../styles'

const inputEditorOptions = {
  fontSize: 16,
  minimap: {
    enabled: false
  },
  wordWrap: 'bounded'
}

const outputEditorOptions = {
  ...inputEditorOptions,
  readOnly: true
}

const Transform = ({ transcode, validate }) => {
  const editorRef = React.useRef()
  const [input] = React.useState('')
  const [output, setOutput] = React.useState('')
  const [errors, setError] = React.useState('')

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor
    listenEditorChagnes()
  }

  function listenEditorChagnes() {
    editorRef.current.onDidChangeModelContent(ev => {
      validate && setError(validate(editorRef.current.getValue()));
      const output = transcode(editorRef.current.getValue())
      setOutput(output)
    })
  }

  return (
    <EditorWrapper>
      <Editor
        value={input}
        language="text"
        theme={'solarized-dark'}
        options={inputEditorOptions}
        editorDidMount={handleEditorDidMount}
      />
      <Editor
        value={output}
        language="text"
        theme={'solarized-dark'}
        options={outputEditorOptions}
      />
      {errors && <Error>{errors}</Error>}
    </EditorWrapper>
  )
}

export default Transform
