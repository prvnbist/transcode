import styled from 'styled-components'

const TextArea = styled.textarea`
	color: #fff;
	resize: none;
	background: ${props => props.theme.dark2};
	width: ${props => `${props.theme.basePt * 60}px`};
	padding: ${props => `${props.theme.basePt * 1}px`};
	height: ${props => `${props.theme.basePt * 15}px`};
	font-size: ${props => `${props.theme.basePt * 2}px`};
	line-height: ${props => `${props.theme.basePt * 3}px`};
	border: ${props => `1px solid ${props.theme.borderColor}`};
	@media (max-width: 568px) {
		width: 100%;
	}
`

export default TextArea
