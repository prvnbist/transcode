import React from 'react'
import styled from 'styled-components'

import { Container, Title3 } from '../../styles/index'

const morse = {
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

const MorseTable = () => {
	return (
		<React.Fragment>
			<Title3>Morse Table</Title3>
			<Container col_md={3} col_sm={2} gap={16}>
				{Object.entries(morse).map(([letter, sequence]) => (
					<Letter key={letter}>
						<LetterName>{letter}</LetterName>
						<LetterCode>
							{sequence.map(i => (i === 0 ? '.' : '-')).join('')}
						</LetterCode>
					</Letter>
				))}
			</Container>
		</React.Fragment>
	)
}

export default MorseTable

const Letter = styled.div`
	display: flex;
	align-items: center;
	background: ${props => props.theme.dark2};
	padding: ${props => `${props.theme.basePt * 2}px`};
	border-radius: ${props => `${props.theme.basePt * 0.75}px`};
`

const LetterName = styled.span`
	text-transform: uppercase;
	border-right: ${props => `2px solid ${props.theme.dark1}`};
	font-size: ${props => `${props.theme.basePt * 2.5}px`};
	margin-right: ${props => `${props.theme.basePt * 2}px`};
	padding-right: ${props => `${props.theme.basePt * 2}px`};
`

const LetterCode = styled.i`
	font-weight: bold;
	font-size: ${props => `${props.theme.basePt * 3}px`};
`
