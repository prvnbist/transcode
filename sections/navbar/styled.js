import styled from 'styled-components'

export const Nav = styled.nav`
   grid-area: nav;
   border: ${props => `1px solid ${props.theme.dark2}`};
   border-top: none;
   @media (max-width: 860px) {
      left: 0;
      bottom: 0;
      width: 320px;
      z-index: 1000;
      position: fixed;
      transition: 0.3s ease-in-out;
      transform: translateX(-320px);
      background: ${props => props.theme.dark1};
      top: ${props => `${props.theme.basePt * 7}px`};
      &.active {
         transform: translateX(0);
      }
   }
`

export const Section = styled.section`
   border-bottom: ${props => `1px solid ${props.theme.dark2}`};
`
export const Header = styled.header`
   display: flex;
   cursor: pointer;
   align-items: center;
   justify-content: space-between;
   height: ${props => `${props.theme.basePt * 6}px`};
   padding: ${props => `0 ${props.theme.basePt * 2}px`};
   border-bottom: ${props => `1px solid ${props.theme.dark2}`};
   :hover {
      background: ${props => props.theme.dark2};
   }
`
export const List = styled.ul`
   margin-top: -1px;
   margin-left: ${props => `${props.theme.basePt * 2}px`};
   border-left: ${props => `1px solid ${props.theme.dark2}`};
   a {
      color: #fff;
      text-decoration: none;
   }
`
export const ListItem = styled.li`
   color: #fff;
   font-size: 14px;
   list-style: none;
   cursor: pointer;
   position: relative;
   height: ${props => `${props.theme.basePt * 5}px`};
   line-height: ${props => `${props.theme.basePt * 5}px`};
   padding-left: ${props => `${props.theme.basePt * 2}px`};
   ::before {
      left: 0;
      top: 50%;
      height: 1px;
      content: '';
      position: absolute;
      background: ${props => props.theme.dark2};
      width: ${props => `${props.theme.basePt * 1}px`};
   }
   :hover {
      background: ${props => props.theme.dark2};
   }
`
