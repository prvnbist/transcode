import styled from 'styled-components'

export const Container = styled.div`
   display: grid;
   grid-gap: ${props => `${props.gap}px`};
   grid-template-columns: ${props => `repeat(${props.col}, 1fr)`};
`
