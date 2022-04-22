import React from 'react'
import { NextPage } from 'next'
import Editor, { useMonaco } from '@monaco-editor/react'

type InputEditorProps = {
   input: string
   height: string
   editorOptions: object
   setInput: (input: string) => void
   language: 'text' | 'json' | 'html' | undefined
}

const InputEditor: NextPage<InputEditorProps> = ({
   input,
   height,
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
         height={height}
         options={editorOptions}
         defaultLanguage={language}
         onChange={value => setInput(value)}
      />
   )
}

export default InputEditor
