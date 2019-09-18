import styled from 'styled-components'

const EditorWrapper = styled.div`
	display: grid;
	height: 100%;
	position: relative;
	grid-template-columns: repeat(2, 1fr);
	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		grid-template-rows: calc(50vh - 28px) calc(50vh - 28px);
	}
`

export default EditorWrapper
