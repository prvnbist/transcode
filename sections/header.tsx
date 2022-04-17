import Link from 'next/link'
import tw from 'twin.macro'
import { NextPage } from 'next'
import GitHubButton from 'react-github-btn'

const Header: NextPage = () => {
   return (
      <header tw="h-12 border-b border-[#25252a] px-4 flex items-center justify-between">
         <h2>
            <Link href="/">
               <a>Transcode</a>
            </Link>
         </h2>
         <div tw="h-[20px] flex gap-2">
            <GitHubButton
               data-show-count="true"
               href="https://github.com/prvnbist"
               aria-label="Follow @prvnbist on GitHub"
               data-color-scheme="no-preference: dark; light: light; dark: dark;"
            >
               Follow @prvnbist
            </GitHubButton>
            <GitHubButton
               data-show-count="true"
               data-icon="octicon-star"
               href="https://github.com/prvnbist/transcode"
               aria-label="Star prvnbist/transcode on GitHub"
               data-color-scheme="no-preference: dark; light: light; dark: dark;"
            >
               Star
            </GitHubButton>
         </div>
      </header>
   )
}

export default Header
