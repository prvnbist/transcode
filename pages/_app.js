import React from 'react'
import { ThemeProvider } from 'styled-components'

import '../styles/globals.css'

import { Header, NavBar } from '../sections'
import { Wrapper, App } from '../styles/styles'

const theme = {
   basePt: 8,
   dark1: '#282C35',
   dark2: '#373D49',
   active: '#7E8CE0',
   warning: '#FFAF5F',
   borderColor: '#373d49',
}

function MyApp({ Component, pageProps }) {
   const [isMenuVisible, toggleMenu] = React.useState(false)
   return (
      <ThemeProvider theme={theme}>
         <Wrapper>
            <Header toggleMenu={toggleMenu} isMenuVisible={isMenuVisible} />
            <NavBar isMenuVisible={isMenuVisible} />
            <App>
               <Component {...pageProps} />
            </App>
         </Wrapper>
      </ThemeProvider>
   )
}

export default MyApp
