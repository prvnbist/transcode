import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home() {
   const router = useRouter()

   React.useEffect(() => {
      router.push('/morse/text-to-morse')
   }, [])

   return (
      <>
         <Head>
            <title>Transcode</title>
         </Head>
      </>
   )
}
