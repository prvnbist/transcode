import styled from 'styled-components'

export const Error = styled.div`
   position: absolute;
   bottom: 0;
   right: 0;
   left: 0;
   background: ${props => props.theme.warning};
   height: ${props => `${props.theme.basePt * 8}px`};
   padding: ${props => `0 ${props.theme.basePt * 2}px`};
   line-height: ${props => `${props.theme.basePt * 8}px`};
`
