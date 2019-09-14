import styled from 'styled-components'

const Tip = styled.span`
	float: right;
	text-transform: capitalize;
	line-height: ${props => `${props.theme.basePt * 5}px`};
`

export default Tip
