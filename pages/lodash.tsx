import React from 'react'
import tw from 'twin.macro'

import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import snakeCase from 'lodash.snakecase'
import startCase from 'lodash.startcase'
import lowerCase from 'lodash.lowercase'
import upperCase from 'lodash.uppercase'
import capitalize from 'lodash.capitalize'

import Layout from '../sections/layout'
import { NextPage } from 'next'

const METHODS = {
   CAMEL_CASE: (input: string): string => camelCase(input),
   KEBAB_CASE: (input: string): string => kebabCase(input),
   SNAKE_CASE: (input: string): string => snakeCase(input),
   START_CASE: (input: string): string => startCase(input),
   LOWER_CASE: (input: string): string => lowerCase(input),
   UPPER_CASE: (input: string): string => upperCase(input),
   CAPITALIZE: (input: string): string => capitalize(input),
}

const Lodash = (): JSX.Element => {
   const [option, setOption] = React.useState('CAMEL_CASE')
   return (
      <Layout
         translator={METHODS[option]}
         settings={<Settings option={option} setOption={setOption} />}
      />
   )
}

export default Lodash

type SettingsProps = {
   option: string
   setOption: (option: string) => void
}

const Settings: NextPage<SettingsProps> = ({
   option,
   setOption,
}): JSX.Element => {
   return (
      <div>
         <select
            id="type"
            name="type"
            value={option}
            onChange={e => setOption(e.target.value)}
            tw="px-2 text-sm bg-[#25252a] w-full h-10 rounded hover:(bg-[#222227])"
         >
            <option value="CAMEL_CASE">Camel Case</option>
            <option value="KEBAB_CASE">Kebab Case</option>
            <option value="SNAKE_CASE">Snake Case</option>
            <option value="START_CASE">Start Case</option>
            <option value="LOWER_CASE">Lower Case</option>
            <option value="UPPER_CASE">Upper Case</option>
            <option value="CAPITALIZE">Capitalize</option>
         </select>
      </div>
   )
}
