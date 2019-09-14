import styled from 'styled-components'

const Error = styled.div`
	height: auto;
	background: ${props => props.theme.warning};
	line-height: ${props => `${props.theme.basePt * 5}px`};
	margin-bottom: ${props => `${props.theme.basePt * 3}px`};
	border-radius: ${props => `${props.theme.basePt * 0.5}px`};
	padding-left: ${props => `${props.theme.basePt * 1.75}px`};
`

export default Error
