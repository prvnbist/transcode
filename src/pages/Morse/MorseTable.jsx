import React from 'react'
import styled from 'styled-components'

import { Container } from '../../styles/index'

const MorseTable = ({ morse }) => {
	return (
		<React.Fragment>
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
	background: var(--dark2);
	padding: calc(var(--base-pt) * 2px);
	border-radius: calc(var(--base-pt) * 0.75px);
`

const LetterName = styled.span`
	text-transform: uppercase;
	border-right: 2px solid var(--dark1);
	font-size: calc(var(--base-pt) * 2.5px);
	margin-right: calc(var(--base-pt) * 2px);
	padding-right: calc(var(--base-pt) * 2px);
`

const LetterCode = styled.i`
	font-weight: bold;
	font-size: calc(var(--base-pt) * 3px);
`
