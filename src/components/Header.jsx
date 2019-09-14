import React from 'react'
import GitHubButton from 'react-github-btn'
import styled from 'styled-components'

const Header = () => {
	return (
		<NavBar>
			<Brand>Morse Translator</Brand>
			<GitHubButton
				href="https://github.com/prvnbist/morse-translator"
				data-size="large"
				data-show-count="true"
				aria-label="Star prvnbist/morse-translator on GitHub">
				Star
			</GitHubButton>
		</NavBar>
	)
}

export default Header

const NavBar = styled.nav`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: calc(var(--base-pt) * 10px);
`

const Brand = styled.h2`
	font-weight: 100;
`
