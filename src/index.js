import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

import { MorseTable, MorseToText, TextToMorse } from './pages/Morse/index'
import { Encode, Decode } from './pages/URL/index'

import Header from './components/Header'
import NavBar from './components/NavBar'

const GlobalStyle = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: ${props => props.theme.font};
	}

	body {
		color: #fff;
		overflow: hidden;
		background:  ${props => props.theme.dark1};
	}
`

const Wrapper = styled.div`
	margin: auto;
	display: grid;
	height: 100vh;
	width: 100%;
	grid-template-areas: 'head head' 'nav main';
	grid-template-rows: ${props => `${props.theme.basePt * 7}px`} 1fr;
	grid-template-columns: ${props => `${props.theme.basePt * 40}px`} 1fr;
	@media (max-width: 860px) {
		width: 100%;
		position: relative;
		grid-template-areas: 'head head' 'main main';
		grid-template-columns: 1fr;
	}
`

const App = styled.div`
	grid-area: main;
`

const theme = {
	basePt: 8,
	dark1: '#282C35',
	dark2: '#373D49',
	active: '#7E8CE0',
	warning: '#FFAF5F',
	borderColor: '#373d49',
	font: "'Fira Code', monospace"
}

const Main = () => {
	const [isMenuVisible, toggleMenu] = React.useState(false)
	return (
		<Router>
			<ThemeProvider theme={theme}>
				<Wrapper>
					<GlobalStyle />
					<Header toggleMenu={toggleMenu} />
					<NavBar isMenuVisible={isMenuVisible} />
					<App>
						<Route path="/" exact component={TextToMorse} />
						<Route
							path="/morse/text-to-morse"
							component={TextToMorse}
						/>
						<Route
							path="/morse/morse-to-text"
							component={MorseToText}
						/>
						<Route
							path="/morse/morse-table"
							component={MorseTable}
						/>
						<Route path="/url/encode" component={Encode} />
						<Route path="/url/decode" component={Decode} />
					</App>
				</Wrapper>
			</ThemeProvider>
		</Router>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Main />, rootElement)
