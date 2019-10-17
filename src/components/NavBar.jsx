import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ArrowIcon = ({ width, color }) => (
	<svg
		width={width}
		height={width / 1.66}
		viewBox="0 0 7 3"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path d="M7 3L3.5 0L0 3L7 3Z" fill={color} />
	</svg>
)

const NavBar = ({ isMenuVisible }) => {
	const [isListVisible, setListVisibility] = React.useState({
		morse: true
	})

	const toggleSection = type => {
		setListVisibility({
			[type]: true
		})
	}

	const navItems = [
		{
			name: 'Morse',
			type: 'morse',
			links: [
				{
					name: 'Text to Morse',
					path: '/morse/text-to-morse'
				},
				{
					name: 'Morse To Text',
					path: '/morse/morse-to-text'
				},
				{
					name: 'Morse Table',
					path: '/morse/morse-table'
				}
			]
		},
		{
			name: 'URL',
			type: 'url',
			links: [
				{
					name: 'Encode',
					path: '/url/encode'
				},
				{
					name: 'Decode',
					path: '/url/decode'
				}
			]
		}
	]

	return (
		<Nav isMenuVisible={isMenuVisible}>
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
									<Link to={link.path} key={link.path}>
										<ListItem>{link.name}</ListItem>
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

export default NavBar

const Nav = styled.nav`
	grid-area: nav;
	border: ${props => `1px solid ${props.theme.dark2}`};
	border-top: none;
	@media (max-width: 860px) {
		position: fixed;
		bottom: 0;
		z-index: 1000;
		display: ${props => (props.isMenuVisible ? 'block' : 'none')};
		background: ${props => props.theme.dark1};
		top: ${props => `${props.theme.basePt * 7}px`};
		width: ${props => `${props.theme.basePt * 40}px`};
	}
`

const Section = styled.section`
	border-bottom: ${props => `1px solid ${props.theme.dark2}`};
`
const Header = styled.header`
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
const List = styled.ul`
	margin-left: ${props => `${props.theme.basePt * 2}px`};
	border-left: ${props => `1px solid ${props.theme.dark2}`};
	a {
		text-decoration: none;
	}
`
const ListItem = styled.li`
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
