import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const IndexPage: NextPage = () => {
   const router = useRouter()
   React.useEffect(() => {
      router.push('/lodash')
   }, [router])
   return null
}

export default IndexPage
