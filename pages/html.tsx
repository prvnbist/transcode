import React from 'react'
import axios from 'axios'
import tw from 'twin.macro'
import { NextPage } from 'next'
import * as htmltoast from 'html-to-ast'
import { useRouter } from 'next/router'
import kebabCase from 'lodash.kebabcase'

import Layout from '../sections/layout'

const METHODS: { [key: string]: (input: string) => string | Promise<string> } =
   {
      PUG: async (input: string): Promise<string> => {
         try {
            const { data = {} } = await axios.post('/api/html-to-pug', {
               input,
            })

            return data?.output || ''
         } catch (error) {
            return 'Something went wrong during conversion, please try again!'
         }
      },
      JSX: async (input: string): Promise<string> => {
         try {
            const { data = {} } = await axios.post('/api/html-to-jsx', {
               input,
            })

            return data?.output || ''
         } catch (error) {
            return 'Something went wrong during conversion, please try again!'
         }
      },
      AST: (input: string): string =>
         JSON.stringify(htmltoast.parse(input), null, 4),
   }

const TRANSLATORS: { [key: string]: string } = {
   pug: 'PUG',
   jsx: 'JSX',
   ast: 'AST',
}

const HTML: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [option, setOption] = React.useState('PUG')
   const [outputLanguage, setOutputLanguage] = React.useState('pug')

   React.useEffect(() => {
      if (
         router?.query?.translator &&
         (router?.query?.translator as string) in TRANSLATORS
      ) {
         if (TRANSLATORS?.[router?.query?.translator as string] === 'PUG') {
            setOption('PUG')
            setOutputLanguage('pug')
         } else if (
            TRANSLATORS?.[router?.query?.translator as string] === 'JSX'
         ) {
            setOption('JSX')
            setOutputLanguage('javascript')
         } else if (
            TRANSLATORS?.[router?.query?.translator as string] === 'AST'
         ) {
            setOption('AST')
            setOutputLanguage('json')
         }
      }
   }, [router])
   return (
      <Layout
         translator={METHODS[option]}
         language={{
            input: 'html',
            output: outputLanguage,
         }}
         settings={<Settings option={option} setOption={setOption} />}
      />
   )
}

export default HTML

type SettingsProps = {
   option: string
   setOption: (option: string) => void
}

const Settings: NextPage<SettingsProps> = ({
   option,
   setOption,
}): JSX.Element => {
   const router = useRouter()
   return (
      <div>
         <select
            id="type"
            name="type"
            value={option}
            onChange={e => {
               setOption(e.target.value)
               router.query.translator = kebabCase(e.target.value)
               router.push(router)
            }}
            tw="px-3 text-sm bg-transparent border border-[#25252a] w-full h-10 rounded outline-none focus:(bg-[#25252a]) hover:(bg-[#25252a])"
         >
            <option value="PUG" tw="bg-[#25252a]">
               Pug
            </option>
            <option value="JSX" tw="bg-[#25252a]">
               JSX
            </option>
            <option value="AST" tw="bg-[#25252a]">
               AST
            </option>
         </select>
      </div>
   )
}
