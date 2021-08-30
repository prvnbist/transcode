import React from 'react'
import Editor from '@monaco-editor/react'

import { EditorWrapper } from '../../styles/components'

const options = {
   fontSize: 16,
   minimap: {
      enabled: false,
   },
   wordWrap: 'bounded',
}

export const MonacoEditor = ({ validator = null, transformer }) => {
   const [value, setValue] = React.useState('')

   const onMount = () => {
      console.log('called')
      setValue('')
   }

   const onChange = value => {
      const transformed = transformer(value)
      setValue(transformed)
   }

   return (
      <EditorWrapper>
         <Editor
            height="98vh"
            options={options}
            onChange={onChange}
            defaultLanguage="text"
            onMount={onMount}
         />
         <Editor
            height="98vh"
            value={value}
            defaultLanguage="text"
            options={{ ...options, readOnly: true }}
         />
      </EditorWrapper>
   )
}
