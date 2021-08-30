import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MonacoEditor } from '../../sections/editor'

import lowercase from 'lodash/lowerCase'
import uppercase from 'lodash/upperCase'
import camelcase from 'lodash/camelCase'
import kebabcase from 'lodash/kebabCase'
import snakecase from 'lodash/snakeCase'
import capitalize from 'lodash/capitalize'

export default function TextTransform() {
   const router = useRouter()
   const { transform } = router.query

   return (
      <>
         <Head>
            <title>Transcode</title>
         </Head>
         <main>
            <MonacoEditor transformer={methods[transform]} />
         </main>
      </>
   )
}

const methods = {
   lowercase: lowercase,
   UPPERCASE: uppercase,
   camelCase: camelcase,
   'kebab-case': kebabcase,
   snake_case: snakecase,
   snake_case: snakecase,
   Capitalize: capitalize,
}
