import styled from 'styled-components'

const Button = styled.button`
	color: #fff;
	padding: 0 12px;
	cursor: pointer;
	border: 1px solid #fff;
	background: transparent;
	height: calc(var(--base-pt) * 6px);
	font-size: calc(var(--base-pt) * 2px);
	margin-bottom: calc(var(--base-pt) * 3px);
	:hover {
		color: #1e162b;
		font-weight: bold;
		background: #ffffff;
	}
`

export default Button
