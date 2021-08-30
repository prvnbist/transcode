import React from 'react'
import isUrl from 'is-url'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MonacoEditor } from '../../sections/editor'

export default function Url() {
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
   encode: encodeURIComponent,
   decode: decodeURIComponent,
   parse: url => (isUrl(url) ? JSON.stringify(new Url(url), null, 4) : ''),
}
