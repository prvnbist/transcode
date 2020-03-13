import React from 'react'
import GitHubButton from 'react-github-btn'
import { Link } from 'react-router-dom'

import Logo from '../../assets/Logo'

import { HeaderContainer, Brand, MenuIcon } from './styled'

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
				href="https://github.com/prvnbist/transcode"
				data-size="large"
				data-show-count="true"
				aria-label="Star prvnbist/morse-translator on GitHub">
				Star
			</GitHubButton>
		</HeaderContainer>
	)
}

export default Header
