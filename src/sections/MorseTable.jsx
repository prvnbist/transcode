import React from 'react'

const MorseTable = ({ morse }) => {
	return (
		<React.Fragment>
			<div id="morse__table">
				{Object.entries(morse).map(([letter, sequence]) => (
					<div className="letter" key={letter}>
						<span>{letter}</span>
						<i>
							{sequence.map(i => (i === 0 ? '.' : '-')).join('')}
						</i>
					</div>
				))}
			</div>
		</React.Fragment>
	)
}

export default MorseTable
