import React from 'react'
import { NextPage } from 'next'
import Editor, { useMonaco } from '@monaco-editor/react'

type InputEditorProps = {
   input: string
   editorOptions: object
   setInput: (input: string) => void
   language: 'text' | 'json' | undefined
}

const InputEditor: NextPage<InputEditorProps> = ({
   input,
   setInput,
   editorOptions,
   language = 'text',
}) => {
   const monaco = useMonaco()

   React.useEffect(() => {
      if (monaco) {
         monaco.editor.defineTheme('custom', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
               'editor.background': '#19191c',
            },
         })
      }
   }, [monaco])

   return (
      <Editor
         value={input}
         theme="custom"
         options={editorOptions}
         defaultLanguage={language}
         height="calc(100vh - 48px)"
         onChange={value => setInput(value)}
      />
   )
}

export default InputEditor
