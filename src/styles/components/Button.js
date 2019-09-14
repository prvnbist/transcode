import styled from 'styled-components'

const Button = styled.button`
	color: #fff;
	padding: 0 12px;
	cursor: pointer;
	border: 1px solid #fff;
	background: transparent;
	height: ${props => `${props.theme.basePt * 6}px`};
	font-size: ${props => `${props.theme.basePt * 2}px`};
	margin-bottom: ${props => `${props.theme.basePt * 3}px`};
	:hover {
		color: #1e162b;
		font-weight: bold;
		background: #ffffff;
	}
`

export default Button
