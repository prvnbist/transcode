import React from 'react'
import ReactDOM from 'react-dom'

import { createGlobalStyle } from 'styled-components'

import App from './App'
import Header from './components/Header'

const GlobalStyle = createGlobalStyle`
	:root {
		--dark1: #282C35;
		--dark2: #373D49;
		--active: #7E8CE0;
		--warning: #FFAF5F;
		--border-color: #373d49;

		--base-pt: 8;
	
		--container-width: 524px;
		--font: "Share Tech Mono", monospace;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: var(--font);
	}

	body {
		color: #fff;
		background: var(--dark1);
		font-family: var(--font);
	}

	#root {
		margin: auto;
		display: flex;
		flex-direction: column;
		width: var(--container-width);
		padding-bottom: calc(var(--base-pt) * 3px);
	}

	@media (max-width: 568px) {
		#root {
			width: calc(100vw - calc(var(--base-pt) * 5px));
		}
	}
`

const rootElement = document.getElementById('root')
ReactDOM.render(
	<React.Fragment>
		<GlobalStyle />
		<Header />
		<App />
	</React.Fragment>,
	rootElement
)
