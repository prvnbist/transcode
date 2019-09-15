import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Title3, Title4, Paragraph, Button } from '../styles/index'

const Cards = styled.div``
const Card = styled.div`
	height: auto;
	display: flex;
	background: ${props => props.theme.dark2};
	padding: ${props => `${props.theme.basePt * 2}px`};
	border-radius: ${props => `${props.theme.basePt * 0.5}px`};
`

const Homepage = () => {
	return (
		<div>
			<Title3 pt={3} pb={3}>
				Tools
			</Title3>
			<Cards>
				<Card>
					<div>
						<Title4 pb={2}>Morse</Title4>
						<Paragraph>
							Morse code is a character encoding scheme used in
							telecommunication that encodes text characters as
							standardized sequences of two different signal
							durations called dots and dashes
						</Paragraph>
						<Button mt={2}>
							<Link to="/morse/text-to-morse">Visit</Link>
						</Button>
					</div>
				</Card>
			</Cards>
		</div>
	)
}

export default Homepage
