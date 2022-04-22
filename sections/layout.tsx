import React from 'react'
import tw from 'twin.macro'
import { NextPage } from 'next'

import Header from './header'
import InputEditor from './editors/input'
import OutputEditor from './editors/output'

const editorOptions = {
   fontSize: 13,
   fontLigature: true,
}

type LayoutProps = {
   settings: JSX.Element
   language?:
      | {
           input?: 'text' | 'html' | undefined
           output?: 'text' | 'json' | 'pug' | 'javascript' | undefined
        }
      | undefined
   translator: ((input: string) => string | Promise<string>) | null
}

const Layout: NextPage<LayoutProps> = ({
   settings,
   translator,
   language,
}): JSX.Element => {
   const [input, setInput] = React.useState('')
   const [output, setOutput] = React.useState('')

   const translate = async () => {
      setOutput((await translator?.(input)) || '')
   }

   return (
      <div tw="h-screen w-screen">
         <Header />
         <section tw="grid grid-cols-10">
            <section tw="col-span-4">
               <InputEditor
                  input={input}
                  setInput={setInput}
                  editorOptions={editorOptions}
                  language={language?.input || 'text'}
               />
            </section>
            <section tw="col-span-2 p-3 border-l border-r border-[#25252a]">
               <button
                  onClick={translate}
                  tw="flex items-center justify-between text-sm bg-transparent border border-[#25252a] w-full h-10 rounded outline-none focus:(bg-[#25252a]) hover:(bg-[#25252a])"
               >
                  <span tw="w-8 h-full flex items-center justify-center">
                     <LeftArrowIcon />
                  </span>
                  Translate
                  <span tw="w-8 h-full flex items-center justify-center">
                     <RightArrowIcon />
                  </span>
               </button>
               <div tw="py-3">{settings}</div>
            </section>
            <section tw="col-span-4">
               <OutputEditor
                  output={output}
                  editorOptions={editorOptions}
                  language={language?.output || 'text'}
               />
            </section>
         </section>
      </div>
   )
}

export default Layout

const RightArrowIcon = ({ size = 18, ...props }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <path d="M9 18l6-6-6-6" />
   </svg>
)

const LeftArrowIcon = ({ size = 18, ...props }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <path d="M15 18l-6-6 6-6" />
   </svg>
)
