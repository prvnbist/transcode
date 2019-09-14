import styled from 'styled-components'

const TextArea = styled.textarea`
	color: #fff;
	resize: none;
	background: var(--dark2);
	width: calc(var(--base-pt) * 60px);
	padding: calc(var(--base-pt) * 1px);
	height: calc(var(--base-pt) * 15px);
	border: 1px solid var(--border-color);
	font-size: calc(var(--base-pt) * 2px);
	line-height: calc(var(--base-pt) * 3px);
	@media (max-width: 568px) {
		width: 100%;
	}
`

export default TextArea
