import React from 'react'
import GitHubButton from 'react-github-btn'
import { Link } from 'react-router-dom'

import Logo from '../../assets/Logo'

import { HeaderContainer, Brand, MenuIcon } from './styled'

const Header = ({ isMenuVisible, toggleMenu }) => {
	return (
		<HeaderContainer>
			<Brand>
				<MenuIcon
					onClick={e => toggleMenu(!isMenuVisible)}
					className={`${isMenuVisible ? 'active' : ''}`}>
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
