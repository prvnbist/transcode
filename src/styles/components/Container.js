import styled from 'styled-components'

const Container = styled.div`
	display: grid;
	grid-gap: ${props => `${props.gap}px`};
	grid-template-columns: ${props => `repeat(${props.col_md}, 1fr)`};
	@media (max-width: 568px) {
		grid-template-columns: ${props => `repeat(${props.col_sm}, 1fr)`};
	}
`
export default Container
