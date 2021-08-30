import React from 'react'
import Link from 'next/link'

import { Nav, Section, Header, List, ListItem } from './styled'

const ArrowIcon = ({ width, color }) => (
   <svg
      width={width}
      height={width / 1.66}
      viewBox="0 0 7 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path d="M7 3L3.5 0L0 3L7 3Z" fill={color} />
   </svg>
)

export const NavBar = ({ isMenuVisible }) => {
   const [isListVisible, setListVisibility] = React.useState({
      morse: true,
   })

   const toggleSection = type => {
      setListVisibility({
         [type]: !isListVisible[type],
      })
   }

   const navItems = [
      {
         name: 'Morse',
         type: 'morse',
         links: [
            {
               name: 'Text to Morse',
               path: '/morse/text-to-morse',
            },
            {
               name: 'Morse To Text',
               path: '/morse/morse-to-text',
            },
         ],
      },
      {
         name: 'URL',
         type: 'url',
         links: [
            {
               name: 'Encode',
               path: '/url/encode',
            },
            {
               name: 'Decode',
               path: '/url/decode',
            },
            {
               name: 'Parse',
               path: '/url/parse',
            },
         ],
      },
      {
         name: 'Text Transform',
         type: 'text_transform',
         links: [
            {
               name: 'lowercase',
               path: '/text-transform/lowercase',
            },
            {
               name: 'UPPERCASE',
               path: '/text-transform/UPPERCASE',
            },
            {
               name: 'camelCase',
               path: '/text-transform/camelCase',
            },
            {
               name: 'kebab-case',
               path: '/text-transform/kebab-case',
            },
            {
               name: 'snake_case',
               path: '/text-transform/snake_case',
            },
         ],
      },
   ]

   return (
      <Nav className={`${isMenuVisible ? 'active' : ''}`}>
         {navItems.map(item => (
            <Section key={item.type}>
               <Header onClick={() => toggleSection(item.type)}>
                  <span>{item.name}</span>
                  <ArrowIcon width={10} color="#fff" />
               </Header>
               <List>
                  {isListVisible[item.type] && (
                     <>
                        {item.links.map(link => (
                           <Link href={link.path} key={link.path}>
                              <a>
                                 <ListItem>{link.name}</ListItem>
                              </a>
                           </Link>
                        ))}
                     </>
                  )}
               </List>
            </Section>
         ))}
      </Nav>
   )
}
