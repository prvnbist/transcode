import React from 'react'
import tw from 'twin.macro'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import snakeCase from 'lodash.snakecase'
import startCase from 'lodash.startcase'
import lowerCase from 'lodash.lowercase'
import upperCase from 'lodash.uppercase'
import capitalize from 'lodash.capitalize'

import Layout from '../sections/layout'

const METHODS: { [key: string]: (input: string) => string } = {
   CAMEL_CASE: (input: string): string => camelCase(input),
   KEBAB_CASE: (input: string): string => kebabCase(input),
   SNAKE_CASE: (input: string): string => snakeCase(input),
   START_CASE: (input: string): string => startCase(input),
   LOWER_CASE: (input: string): string => lowerCase(input),
   UPPER_CASE: (input: string): string => upperCase(input),
   CAPITALIZE: (input: string): string => capitalize(input),
}

const TRANSLATORS: { [key: string]: string } = {
   'camel-case': 'CAMEL_CASE',
   'kebab-case': 'KEBAB_CASE',
   'snake-case': 'SNAKE_CASE',
   'start-case': 'START_CASE',
   'lower-case': 'LOWER_CASE',
   'upper-case': 'UPPER_CASE',
   capitalize: 'CAPITALIZE',
}

const TextPage: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [option, setOption] = React.useState('CAMEL_CASE')

   React.useEffect(() => {
      if (
         router?.query?.translator &&
         (router?.query?.translator as string) in TRANSLATORS
      ) {
         setOption(
            TRANSLATORS?.[router?.query?.translator as string] || 'CAMEL_CASE'
         )
      }
   }, [router])

   return (
      <Layout
         translator={METHODS[option]}
         settings={<Settings option={option} setOption={setOption} />}
      />
   )
}

export default TextPage

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
            <option value="CAMEL_CASE" tw="bg-[#25252a]">
               Camel Case
            </option>
            <option value="KEBAB_CASE" tw="bg-[#25252a]">
               Kebab Case
            </option>
            <option value="SNAKE_CASE" tw="bg-[#25252a]">
               Snake Case
            </option>
            <option value="START_CASE" tw="bg-[#25252a]">
               Start Case
            </option>
            <option value="LOWER_CASE" tw="bg-[#25252a]">
               Lower Case
            </option>
            <option value="UPPER_CASE" tw="bg-[#25252a]">
               Upper Case
            </option>
            <option value="CAPITALIZE" tw="bg-[#25252a]">
               Capitalize
            </option>
         </select>
      </div>
   )
}
