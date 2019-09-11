import React from 'react'
import ReactDOM from 'react-dom'
import GitHubButton from 'react-github-btn'

import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

import TextToMorse from './sections/TextToMorse'
import MorseToText from './sections/MorseToText'
import MorseTable from './sections/MorseTable'

import './styles/index.scss'

// 0 - dot, 1 - dash
const textToMorse = {
	a: [0, 1],
	b: [1, 0, 0, 0],
	c: [1, 0, 1, 0],
	d: [1, 0, 0],
	e: [0],
	f: [0, 0, 1, 0],
	g: [1, 1, 0],
	h: [0, 0, 0, 0],
	i: [0, 0],
	j: [0, 1, 1, 1],
	k: [1, 0, 1],
	l: [0, 1, 0, 0],
	m: [1, 1],
	n: [1, 0],
	o: [1, 1, 1],
	p: [0, 1, 1, 0],
	q: [1, 1, 0, 1],
	r: [0, 1, 0],
	s: [0, 0, 0],
	t: [1],
	u: [0, 0, 1],
	v: [0, 0, 0, 1],
	w: [0, 1, 1],
	x: [1, 0, 0, 1],
	y: [1, 0, 1, 1],
	z: [1, 1, 0, 0]
}
const morseToText = {
	'01': 'a',
	'1000': 'b',
	'1010': 'c',
	'100': 'd',
	'0': 'e',
	'0010': 'f',
	'110': 'g',
	'0000': 'h',
	'00': 'i',
	'0111': 'j',
	'101': 'k',
	'0100': 'l',
	'11': 'm',
	'10': 'n',
	'111': 'o',
	'0110': 'p',
	'1101': 'q',
	'010': 'r',
	'000': 's',
	'1': 't',
	'001': 'u',
	'0001': 'v',
	'011': 'w',
	'1001': 'x',
	'1011': 'y',
	'1100': 'z'
}

const App = () => {
	return (
		<React.Fragment>
			<nav>
				<h2>Morse Translator</h2>
				<GitHubButton
					href="https://github.com/prvnbist/morse-translator"
					data-size="large"
					data-show-count="true"
					aria-label="Star prvnbist/morse-translator on GitHub">
					Star
				</GitHubButton>
			</nav>
			<Tabs>
				<TabList>
					<Tab>Text to Morse</Tab>
					<Tab>Morse to Text</Tab>
					<Tab>Morse Table</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<TextToMorse morse={textToMorse} />
					</TabPanel>
					<TabPanel>
						<MorseToText morse={morseToText} />
					</TabPanel>
					<TabPanel>
						<MorseTable morse={textToMorse} />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</React.Fragment>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
