import React from 'react'
import { NextPage } from 'next'
import Editor, { useMonaco } from '@monaco-editor/react'

type OutputEditorProps = {
   output: string
   editorOptions: object
   language: 'text' | 'json' | 'pug' | 'javascript' | undefined
}

const OutputEditor: NextPage<OutputEditorProps> = ({
   output,
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
         value={output}
         theme="custom"
         height="calc(100vh - 48px)"
         defaultLanguage={language}
         options={{ ...editorOptions, readOnly: true }}
      />
   )
}

export default OutputEditor
