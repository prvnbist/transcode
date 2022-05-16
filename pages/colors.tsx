import React from 'react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import convert from 'color-convert'
import { useRouter } from 'next/router'

const Layout = dynamic(() => import('../sections/layout') as any)
const Translators = dynamic(
   () => import('../components').then(module => module.Translators) as any
)

const METHODS: { [key: string]: (input: string) => string | Promise<string> } =
   {
      HEX_TO_RGB: (input: string): string => {
         try {
            return `${convert.hex.rgb(input.replace('#', ''))}`
         } catch (error) {
            return 'Please input a valid hex color.'
         }
      },
      HEX_TO_CMYK: (input: string): string => {
         try {
            return `${convert.hex.cmyk(input.replace('#', ''))}`
         } catch (error) {
            return 'Please input a valid hex color.'
         }
      },
      HEX_TO_HSL: (input: string): string => {
         try {
            return `${convert.hex.hsl(input.replace('#', ''))}`
         } catch (error) {
            return 'Please input a valid hex color.'
         }
      },
      HEX_TO_HSV: (input: string): string => {
         try {
            return `${convert.hex.hsv(input.replace('#', ''))}`
         } catch (error) {
            return 'Please input a valid hex color.'
         }
      },
      RGB_TO_HEX: (input: string): string => {
         try {
            return `#${convert.rgb.hex(input.split(',') || [])}`
         } catch (error) {
            return 'Please input a valid rgb color.'
         }
      },
      RGB_TO_CMYK: (input: string): string => {
         try {
            return `${convert.rgb.cmyk(input.split(',') || [])}`
         } catch (error) {
            return 'Please input a valid rgb color.'
         }
      },
      RGB_TO_HSL: (input: string): string => {
         try {
            return `${convert.rgb.hsl(input.split(',') || [])}`
         } catch (error) {
            return 'Please input a valid rgb color.'
         }
      },
      RGB_TO_HSV: (input: string): string => {
         try {
            return `${convert.rgb.hsv(input.split(',') || [])}`
         } catch (error) {
            return 'Please input a valid rgb color.'
         }
      },
      KEYWORD_TO_HEX: (input: string): string => {
         try {
            return `${convert.keyword.hex(input)}`
         } catch (error) {
            return 'Please input a valid keyword color.'
         }
      },
      KEYWORD_TO_RGB: (input: string): string => {
         try {
            return `${convert.keyword.rgb(input)}`
         } catch (error) {
            return 'Please input a valid keyword color.'
         }
      },
   }

const TRANSLATORS: { [key: string]: string } = {
   'hex-to-rgb': 'HEX_TO_RGB',
   'hex-to-cmyk': 'HEX_TO_CMYK',
   'hex-to-hsl': 'HEX_TO_HSL',
   'hex-to-hsv': 'HEX_TO_HSV',
   'rgb-to-hex': 'RGB_TO_HEX',
   'rgb-to-cmyk': 'RGB_TO_CMYK',
   'rgb-to-hsl': 'RGB_TO_HSL',
   'rgb-to-hsv': 'RGB_TO_HSV',
   'keyword-to-hex': 'KEYWORD_TO_HEX',
   'keyword-to-rgb': 'KEYWORD_TO_RGB',
}

const Colors: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [option, setOption] = React.useState('HEX_TO_RGB')

   React.useEffect(() => {
      if (
         router?.query?.translator &&
         (router?.query?.translator as string) in TRANSLATORS
      ) {
         const translator = TRANSLATORS?.[router?.query?.translator as string]
         if (translator === 'HEX_TO_RGB') {
            setOption('HEX_TO_RGB')
         } else if (translator === 'HEX_TO_CMYK') {
            setOption('HEX_TO_CMYK')
         } else if (translator === 'HEX_TO_HSL') {
            setOption('HEX_TO_HSL')
         } else if (translator === 'HEX_TO_HSV') {
            setOption('HEX_TO_HSV')
         } else if (translator === 'RGB_TO_HEX') {
            setOption('RGB_TO_HEX')
         } else if (translator === 'RGB_TO_CMYK') {
            setOption('RGB_TO_CMYK')
         } else if (translator === 'RGB_TO_HSL') {
            setOption('RGB_TO_HSL')
         } else if (translator === 'RGB_TO_HSV') {
            setOption('RGB_TO_HSV')
         } else if (translator === 'KEYWORD_TO_HEX') {
            setOption('KEYWORD_TO_HEX')
         } else if (translator === 'KEYWORD_TO_RGB') {
            setOption('KEYWORD_TO_RGB')
         }
      }
   }, [router])
   return (
      <Layout
         convertor={METHODS[option]}
         language={{
            input: 'text',
            output: 'text',
         }}
         translators={
            <Translators
               option={option}
               options={[
                  { value: 'HEX_TO_RGB', label: 'Hex to RGB' },
                  { value: 'HEX_TO_CMYK', label: 'Hex to CMYK' },
                  { value: 'HEX_TO_HSL', label: 'Hex to HSL' },
                  { value: 'HEX_TO_HSV', label: 'Hex to HSV' },
                  { value: 'RGB_TO_HEX', label: 'RGB to Hex' },
                  { value: 'RGB_TO_CMYK', label: 'RGB to CMYK' },
                  { value: 'RGB_TO_HSL', label: 'RGB to HSL' },
                  { value: 'RGB_TO_HSV', label: 'RGB to HSV' },
                  { value: 'KEYWORD_TO_HEX', label: 'Keyword to Hex' },
                  { value: 'KEYWORD_TO_RGB', label: 'Keyword to RGB' },
               ]}
               setOption={setOption}
            />
         }
      />
   )
}

export default Colors
