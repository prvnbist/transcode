import React from 'react'
import ReactDOM from 'react-dom'

import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

import App from './App'
import Header from './components/Header'

const GlobalStyle = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: ${props => props.theme.font};
	}

	body {
		color: #fff;
		background:  ${props => props.theme.dark1};
	}
`

const Wrapper = styled.div`
	margin: auto;
	display: flex;
	flex-direction: column;
	width: ${props => `${props.width}px`};
	padding-bottom: ${props => `${props.theme.basePt * 3}px`};
	@media (max-width: 568px) {
		width: ${props => `calc(100% - ${props.theme.basePt * 5}px)`};
	}
`

const theme = {
	basePt: 8,
	dark1: '#282C35',
	dark2: '#373D49',
	active: '#7E8CE0',
	warning: '#FFAF5F',
	borderColor: '#373d49',
	containerWidth: '524px',
	font: '"Share Tech Mono", monospace'
}

const rootElement = document.getElementById('root')
ReactDOM.render(
	<ThemeProvider theme={theme}>
		<Wrapper width={524}>
			<GlobalStyle />
			<Header />
			<App />
		</Wrapper>
	</ThemeProvider>,
	rootElement
)
