import styled from 'styled-components'

const Button = styled.button`
	color: #fff;
	padding: 0 12px;
	cursor: pointer;
	border: 1px solid #fff;
	background: transparent;
	height: ${props => `${props.theme.basePt * 6}px`};
	font-size: ${props => `${props.theme.basePt * 2}px`};
	margin: ${props =>
		`${props.theme.basePt * (props.mt ? props.mt : 0)}px ${props.theme
			.basePt * (props.mr ? props.mr : 0)}px ${props.theme.basePt *
			(props.mb ? props.mb : 0)}px ${props.theme.basePt *
			(props.ml ? props.ml : 0)}px`};
	a {
		color: #fff;
		text-decoration: none;
	}
	:hover {
		background: #ffffff;
		a {
			color: #1e162b;
			font-weight: bold;
		}
	}
`

export default Button
