import React from 'react'
import axios from 'axios'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { parse as parseToAST } from 'html-to-ast'

const Layout = dynamic(() => import('../sections/layout') as any)
const Translators = dynamic(
   () => import('../components').then(module => module.Translators) as any
)

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
         JSON.stringify(parseToAST(input), null, 4),
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
         convertor={METHODS[option]}
         language={{
            input: 'html',
            output: outputLanguage,
         }}
         translators={
            <Translators
               option={option}
               options={[
                  { value: 'PUG', label: 'Pug' },
                  { value: 'JSX', label: 'JSX' },
                  { value: 'AST', label: 'AST' },
               ]}
               setOption={setOption}
            />
         }
      />
   )
}

export default HTML
