import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { monaco } from '@monaco-editor/react'

import Transform from './pages/Transform'
import {
	kebabCase,
	camelCase,
	upperCase,
	lowerCase,
	snakeCase
} from './pages/textUtils'
import {
	validateTextToMorse,
	validateMorseToText,
	textToMorse,
	morseToText
} from './pages/morseUtils'

import Header from './sections/header'
import NavBar from './sections/navbar'

import editorTheme from './theme/dark'

import './index.css'

import { Wrapper, App } from './styled'

monaco
	.init()
	.then(monaco => {
		monaco.editor.defineTheme('solarized-dark', editorTheme)
		monaco.editor.setTheme('solarized-dark')
	})
	.catch(error =>
		console.error(
			'An error occurred during initialization of Monaco: ',
			error
		)
	)

const theme = {
	basePt: 8,
	dark1: '#282C35',
	dark2: '#373D49',
	active: '#7E8CE0',
	warning: '#FFAF5F',
	borderColor: '#373d49'
}

const Main = () => {
	const [isMenuVisible, toggleMenu] = React.useState(false)
	return (
		<Router>
			<ThemeProvider theme={theme}>
				<Wrapper>
					<Header
						toggleMenu={toggleMenu}
						isMenuVisible={isMenuVisible}
					/>
					<NavBar isMenuVisible={isMenuVisible} />
					<App>
						<Route
							exact
							path="/"
							render={() => (
								<Transform
									transcode={textToMorse}
									validate={validateTextToMorse}
								/>
							)}
						/>
						<Route
							path="/morse/text-to-morse"
							render={() => (
								<Transform
									transcode={textToMorse}
									validate={validateTextToMorse}
								/>
							)}
						/>
						<Route
							path="/morse/morse-to-text"
							render={() => (
								<Transform
									transcode={morseToText}
									validate={validateMorseToText}
								/>
							)}
						/>

						<Route
							path="/url/encode"
							render={() => (
								<Transform transcode={encodeURIComponent} />
							)}
						/>
						<Route
							path="/url/decode"
							render={() => (
								<Transform transcode={decodeURIComponent} />
							)}
						/>
						<Route
							path="/text-transform/lowercase"
							render={() => (
								<Transform transcode={lowerCase} />
							)}
						/>
						<Route
							path="/text-transform/UPPERCASE"
							render={() => (
								<Transform transcode={upperCase} />
							)}
						/>
						<Route
							path="/text-transform/camelCase"
							render={() => (
								<Transform transcode={camelCase} />
							)}
						/>
						<Route
							path="/text-transform/kebab-case"
							render={() => (
								<Transform transcode={kebabCase} />
							)}
						/>
						<Route
							path="/text-transform/snake_case"
							render={() => (
								<Transform transcode={snakeCase} />
							)}
						/>
					</App>
				</Wrapper>
			</ThemeProvider>
		</Router>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Main />, rootElement)
