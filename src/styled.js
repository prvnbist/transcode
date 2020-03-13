import styled from 'styled-components'

export const Wrapper = styled.div`
	margin: auto;
	display: grid;
	height: 100vh;
	width: 100%;
	grid-template-areas: 'head head' 'nav main';
	grid-template-rows: ${props => `${props.theme.basePt * 7}px`} 1fr;
	grid-template-columns: ${props => `${props.theme.basePt * 40}px`} 1fr;
	@media (max-width: 860px) {
		width: 100%;
		position: relative;
		grid-template-areas: 'head head' 'main main';
		grid-template-columns: 1fr;
	}
`

export const App = styled.div`
	grid-area: main;
`
