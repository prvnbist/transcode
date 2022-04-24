import yaml from 'yaml'
import React from 'react'
import { NextPage } from 'next'
import gs from 'generate-schema'
import dynamic from 'next/dynamic'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { jsonToSchema } from '@walmartlabs/json-to-simple-graphql-schema/lib'

const Layout = dynamic(() => import('../sections/layout') as any)
const Translators = dynamic(
   () => import('../components').then(module => module.Translators) as any
)

const METHODS: { [key: string]: (input: string) => string } = {
   YAML: (input: string): string => {
      try {
         return yaml.stringify(JSON.parse(input))
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
   MONGOOSE: (input: string): string => {
      try {
         return JSON.stringify(gs.mongoose(JSON.parse(input)), null, 4)
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
   MYSQL: (input: string): string => {
      try {
         return gs.mysql(JSON.parse(input))
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
   JSON_SCHEMA: (input: string): string => {
      try {
         return JSON.stringify(gs.json(JSON.parse(input)), null, 4)
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
   BIG_QUERY: (input: string): string => {
      try {
         return JSON.stringify(gs.bigquery(JSON.parse(input)), null, 4)
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
   GRAPHQL: (input: string): string => {
      try {
         return jsonToSchema({ jsonInput: input }).value
      } catch (error) {
         return 'Something went wrong during conversion, please try again!'
      }
   },
}

const TRANSLATORS: { [key: string]: string } = {
   yaml: 'YAML',
   mongoose: 'MONGOOSE',
   mysql: 'MYSQL',
   'json-schema': 'JSON_SCHEMA',
   'big-query': 'BIG_QUERY',
   graphql: 'GRAPHQL',
}

const JSONPage: NextPage = (): JSX.Element => {
   const router = useRouter()
   const [option, setOption] = React.useState('YAML')
   const [outputLanguage, setOutputLanguage] = React.useState('yml')

   React.useEffect(() => {
      if (
         router?.query?.translator &&
         (router?.query?.translator as string) in TRANSLATORS
      ) {
         switch (TRANSLATORS?.[router?.query?.translator as string]) {
            case 'YAML': {
               setOption('YAML')
               setOutputLanguage('yml')
               break
            }
            case 'MONGOOSE': {
               setOption('MONGOOSE')
               setOutputLanguage('json')
               break
            }
            case 'MYSQL': {
               setOption('MYSQL')
               setOutputLanguage('sql')
               break
            }
            case 'JSON_SCHEMA': {
               setOption('JSON_SCHEMA')
               setOutputLanguage('json')
               break
            }
            case 'BIG_QUERY': {
               setOption('BIG_QUERY')
               setOutputLanguage('json')
               break
            }
            case 'GRAPHQL': {
               setOption('GRAPHQL')
               setOutputLanguage('graphql')
               break
            }
            default:
               ''
         }
      }
   }, [router])
   return (
      <Layout
         convertor={METHODS[option]}
         language={{
            input: 'json',
            output: outputLanguage,
         }}
         translators={
            <Translators
               option={option}
               setOption={setOption}
               options={[
                  { value: 'YAML', label: 'YAML' },
                  { value: 'MONGOOSE', label: 'Mongoose Schema' },
                  { value: 'MYSQL', label: 'MySQL' },
                  { value: 'JSON_SCHEMA', label: 'JSON Schema' },
                  { value: 'BIG_QUERY', label: 'Big Query' },
                  { value: 'GRAPHQL', label: 'GraphQL' },
               ]}
            />
         }
      />
   )
}

export default JSONPage
