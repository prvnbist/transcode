import React from 'react'
import { NextPage } from 'next'
import Editor, { useMonaco } from '@monaco-editor/react'

type InputEditorProps = {
   input: string
   editorOptions: object
   setInput: (input: string) => void
}

const InputEditor: NextPage<InputEditorProps> = ({
   input,
   setInput,
   editorOptions,
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
         height="calc(100vh - 48px)"
         defaultLanguage="javascript"
         onChange={value => setInput(value)}
      />
   )
}

export default InputEditor
