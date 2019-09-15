import styled from 'styled-components'

const Title4 = styled.h4`
	font-weight: 100;
	font-size: ${props => `${props.theme.basePt * 2.5}px`};
	padding: ${props =>
		`${props.theme.basePt * (props.pt ? props.pt : 0)}px ${props.theme
			.basePt * (props.pr ? props.pr : 0)}px ${props.theme.basePt *
			(props.pb ? props.pb : 0)}px ${props.theme.basePt *
			(props.pl ? props.pl : 0)}px`};
`

export default Title4
