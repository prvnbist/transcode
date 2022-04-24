import React from 'react'
import postcss from 'postcss'
import { NextPage } from 'next'
import postcssJs from 'postcss-js'
import dynamic from 'next/dynamic'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'

const Layout = dynamic(() => import('../sections/layout') as any)
const Translators = dynamic(
   () => import('../components').then(module => module.Translators) as any
)

const METHODS: { [key: string]: (input: string) => string } = {
   JAVASCRIPT: (input: string): string => {
      try {
         return JSON.stringify(
            postcssJs.objectify(postcss.parse(input)),
            null,
            4
         )
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
}

const TRANSLATORS: { [key: string]: string } = {
   javascript: 'JAVASCRIPT',
}

const CSS: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [option, setOption] = React.useState('JAVASCRIPT')
   const [outputLanguage, setOutputLanguage] = React.useState('javascript')

   React.useEffect(() => {
      if (
         router?.query?.translator &&
         (router?.query?.translator as string) in TRANSLATORS
      ) {
         if (
            TRANSLATORS?.[router?.query?.translator as string] === 'JAVASCRIPT'
         ) {
            setOption('JAVASCRIPT')
            setOutputLanguage('javascript')
         }
      }
   }, [router])
   return (
      <Layout
         convertor={METHODS[option]}
         language={{
            input: 'css',
            output: outputLanguage,
         }}
         translators={
            <Translators
               option={option}
               setOption={setOption}
               options={[{ value: 'JAVASCRIPT', label: 'Javascript' }]}
            />
         }
      />
   )
}

export default CSS
