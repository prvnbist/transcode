import styled from 'styled-components'

const Paragraph = styled.p`
	font-weight: 100;
	line-height: ${props => `${props.theme.basePt * 3}px`};
	font-size: ${props => `${props.theme.basePt * 2}px`};
	padding: ${props =>
		`${props.theme.basePt * (props.pt ? props.pt : 0)}px ${props.theme
			.basePt * (props.pr ? props.pr : 0)}px ${props.theme.basePt *
			(props.pb ? props.pb : 0)}px ${props.theme.basePt *
			(props.pl ? props.pl : 0)}px`};
`

export default Paragraph
