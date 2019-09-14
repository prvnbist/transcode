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
