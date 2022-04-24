import React from 'react'
import { NextPage } from 'next'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import kebabCase from 'lodash.kebabcase'

import { useWindowSize } from '../hooks'

type TranslatorsProps = {
   option: string
   options: Array<{
      value: string
      label: string
   }>
   setOption: (option: string) => void
}

export const Translators: NextPage<TranslatorsProps> = ({
   option,
   options,
   setOption,
}): JSX.Element => {
   const router = useRouter()
   const size = useWindowSize()

   const onClick = (option: string): void => {
      setOption(option)
      router.query.translator = kebabCase(option)
      router.push(router)
   }
   if (size?.width < 768) {
      return (
         <Styles.Select
            id="type"
            name="type"
            value={option}
            onChange={e => {
               setOption(e.target.value)
               router.query.translator = kebabCase(e.target.value)
               router.push(router)
            }}
         >
            {options.map(node => (
               <option key={node.value} value={node.value} tw="bg-[#25252a]">
                  {node.label}
               </option>
            ))}
         </Styles.Select>
      )
   }
   return (
      <Styles.Options>
         {options.map(node => (
            <Styles.Option
               key={node.value}
               is_active={option === node.value}
               onClick={() => onClick(node.value)}
            >
               {node.label}
            </Styles.Option>
         ))}
      </Styles.Options>
   )
}

const Styles = {
   Select: styled.select({
      ...tw`px-3 text-sm bg-transparent border border-[#25252a] w-full h-10 rounded outline-none focus:(bg-[#25252a]) hover:(bg-[#25252a])`,
   }),
   Options: styled.ul({
      ...tw`py-1 px-1 flex flex-col gap-1 rounded border border-[#25252a] max-h-[240px] overflow-y-auto`,
   }),
   Option: styled.li({
      ...tw`flex items-center flex-shrink-0 list-none cursor-pointer text-sm rounded px-2 h-8 hover:(bg-[#25252a])`,
      variants: {
         is_active: {
            true: {
               ...tw`bg-[#25252a]`,
            },
         },
      },
   }),
}
