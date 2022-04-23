import React from 'react'
import tw from 'twin.macro'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import snakeCase from 'lodash.snakecase'
import startCase from 'lodash.startcase'
import lowerCase from 'lodash.lowercase'
import upperCase from 'lodash.uppercase'
import capitalize from 'lodash.capitalize'

const Layout = dynamic(() => import('../sections/layout') as any)
const Translators = dynamic(
   () => import('../components').then(module => module.Translators) as any
)

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
         convertor={METHODS[option]}
         translators={
            <Translators
               option={option}
               options={[
                  { value: 'CAMEL_CASE', label: 'Camel Case' },
                  { value: 'KEBAB_CASE', label: 'Kebab Case' },
                  { value: 'SNAKE_CASE', label: 'Snake Case' },
                  { value: 'START_CASE', label: 'Start Case' },
                  { value: 'LOWER_CASE', label: 'Lower Case' },
                  { value: 'UPPER_CASE', label: 'Upper Case' },
                  { value: 'CAPITALIZE', label: 'Capitalize' },
               ]}
               setOption={setOption}
            />
         }
      />
   )
}

export default TextPage
