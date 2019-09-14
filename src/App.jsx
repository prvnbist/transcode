import React from 'react'
import styled from 'styled-components'

import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

import { MorseTable, MorseToText, TextToMorse } from './pages/Morse/index'

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
			<Tabs>
				<StyledTabList>
					<TabItem>Text to Morse</TabItem>
					<TabItem>Morse to Text</TabItem>
					<TabItem>Morse Table</TabItem>
				</StyledTabList>
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

export default App

const StyledTabList = styled(TabList)`
	height: 40px;
	margin-bottom: 24px;
	border-bottom: 1px solid var(--border-color);
	> [data-reach-tab][data-selected] {
		border-bottom: 2px solid var(--active);
	}
	@media (max-width: 568px) {
		display: flex;
		flex-wrap: wrap;
		height: auto;
		border-bottom: none;
	}
`

const TabItem = styled(Tab)`
	height: inherit;
	width: auto;
	padding: 0 12px;
	font-size: 16px;
	border: none;
	color: #fff;
	cursor: pointer;
	background: transparent;
	@media (max-width: 568px) {
		flex: 50%;
		height: 40px;
		border-bottom: 1px solid var(--border-color);
	}
`
