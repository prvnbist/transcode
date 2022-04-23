import React from 'react'
import tw from 'twin.macro'
import Url from 'url-parse'
import isUrl from 'is-url'
import getUrls from 'get-urls'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Layout = dynamic(() => import('../sections/layout') as any)
const Translators = dynamic(
   () => import('../components').then(module => module.Translators) as any
)

const METHODS: { [key: string]: (input: string) => string } = {
   ENCODE: (input: string): string => encodeURIComponent(input),
   DECODE: (input: string): string => decodeURIComponent(input),
   PARSE: (input: string): string => {
      if (!isUrl(input)) {
         return 'Please enter a valid URL!'
      }

      return JSON.stringify(new Url(input), null, 3)
   },
   EXTRACT_LINKS: (input: string): string => {
      return JSON.stringify(Array.from(getUrls(input)), null, 3)
   },
}

const TRANSLATORS: { [key: string]: string } = {
   encode: 'ENCODE',
   decode: 'DECODE',
   parse: 'PARSE',
   'extract-links': 'EXTRACT_LINKS',
}

const URL: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [option, setOption] = React.useState('ENCODE')

   React.useEffect(() => {
      if (
         router?.query?.translator &&
         (router?.query?.translator as string) in TRANSLATORS
      ) {
         setOption(
            TRANSLATORS?.[router?.query?.translator as string] || 'ENCODE'
         )
      }
   }, [router])
   return (
      <Layout
         convertor={METHODS[option]}
         language={{
            input: 'text',
            output: ['PARSE', 'EXTRACT_LINKS'].includes(option)
               ? 'json'
               : 'text',
         }}
         translators={
            <Translators
               option={option}
               options={[
                  { value: 'ENCODE', label: 'Encode' },
                  { value: 'DECODE', label: 'Decode' },
                  { value: 'PARSE', label: 'Parse' },
                  { value: 'EXTRACT_LINKS', label: 'Extract Links' },
               ]}
               setOption={setOption}
            />
         }
      />
   )
}

export default URL
