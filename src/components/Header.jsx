import React from 'react'
import GitHubButton from 'react-github-btn'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Logo from '../assets/Logo'

const Header = ({ toggleMenu }) => {
	const toggleMenuIcon = e => {
		e.stopPropagation()
		if (e.currentTarget.classList.contains('active')) {
			toggleMenu(false)
			return e.currentTarget.classList.remove('active')
		}
		toggleMenu(true)
		return e.currentTarget.classList.add('active')
	}
	return (
		<HeaderContainer>
			<Brand>
				<MenuIcon onClick={e => toggleMenuIcon(e)}>
					<div></div>
					<div></div>
					<div></div>
				</MenuIcon>
				<Link to="/">
					<Logo />
				</Link>
			</Brand>
			<GitHubButton
				href="https://github.com/prvnbist/morse-translator"
				data-size="large"
				data-show-count="true"
				aria-label="Star prvnbist/morse-translator on GitHub">
				Star
			</GitHubButton>
		</HeaderContainer>
	)
}

export default Header

const HeaderContainer = styled.header`
	grid-area: head;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: ${props => `${props.theme.basePt * 7}px`};
	padding-right: ${props => `${props.theme.basePt}px`};
	border-bottom: ${props => `1px solid ${props.theme.dark2}`};
	border-right: ${props => `1px solid ${props.theme.dark2}`};
	@media (max-width: 860px) {
		width: 100%;
		position: fixed;
		background: ${props => props.theme.dark1};
	}
`

const Brand = styled.h2`
	display: flex;
	align-items: center;
	font-weight: 100;
	width: ${props => `${props.theme.basePt * 40}px`};
	height: ${props => `${props.theme.basePt * 10}px`};
	font-size: ${props => `${props.theme.basePt * 3}px`};
	padding: ${props => `0 ${props.theme.basePt * 2}px`};
	line-height: ${props => `${props.theme.basePt * 10}px`};
	border-left: ${props => `1px solid ${props.theme.dark2}`};
	border-right: ${props => `1px solid ${props.theme.dark2}`};
	a {
		color: #fff;
		text-decoration: none;
	}
	@media (max-width: 860px) {
		border-right: none;
	}
`

const MenuIcon = styled.div`
	display: none;
	cursor: pointer;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	width: ${props => `${props.theme.basePt * 5}px`};
	height: ${props => `${props.theme.basePt * 5}px`};
	margin-right: ${props => `${props.theme.basePt}px`};
	div {
		height: 2px;
		width: ${props => `${props.theme.basePt * 3}px`};
		background: #fff;
		&:nth-child(2) {
			margin: 5px 0;
		}
	}
	&.active {
		div {
			&:nth-child(1) {
				transform: translateY(1px) rotate(45deg);
			}
			&:nth-child(2) {
				display: none;
			}
			&:nth-child(3) {
				transform: translateY(-1px) rotate(-45deg);
			}
		}
	}
	@media (max-width: 860px) {
		display: flex;
	}
`
