import React from 'react'
import tw from 'twin.macro'
import Url from 'url-parse'
import isUrl from 'is-url'
import { NextPage } from 'next'
import getUrls from 'get-urls'
import { useRouter } from 'next/router'
import kebabCase from 'lodash.kebabcase'

import Layout from '../sections/layout'

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
         translator={METHODS[option]}
         language={{
            input: 'text',
            output: ['PARSE', 'EXTRACT_LINKS'].includes(option)
               ? 'json'
               : 'text',
         }}
         settings={<Settings option={option} setOption={setOption} />}
      />
   )
}

export default URL

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
            <option value="ENCODE" tw="bg-[#25252a]">
               Encode
            </option>
            <option value="DECODE" tw="bg-[#25252a]">
               Decode
            </option>
            <option value="PARSE" tw="bg-[#25252a]">
               Parse
            </option>
            <option value="EXTRACT_LINKS" tw="bg-[#25252a]">
               Extract Links
            </option>
         </select>
      </div>
   )
}
