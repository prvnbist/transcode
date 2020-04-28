const kebabCase = input => {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

const camelCase = input => {
  const words = input.split(' ').filter(word => word.match(/[a-zA-Z0-9]/))
  const toLowOrUp = (value, type) => {
    if (type === 'low') {
      return value
        .split('')
        .filter(letter => letter.match(/[a-zA-Z0-9]/))
        .map((letter, index) =>
          index === 0 ? letter.toLowerCase() : letter
        )
        .join('')
    }
    return value
      .split('')
      .filter(letter => letter.match(/[a-zA-Z0-9]/))
      .map((letter, index) =>
        index === 0 ? letter.toUpperCase() : letter
      )
      .join('')
  }
  if (words.length === 1) {
    return toLowOrUp(words[0], 'low')
  }
  return words
    .map((word, index) => {
      if (index === 0) {
        return toLowOrUp(word, 'low')
      }
      return toLowOrUp(word, 'up')
    })
    .join('')
}


const upperCase = input => {
  return input.toUpperCase()
}

const lowerCase = input => {
  return input.toLowerCase()
}

const snakeCase = input => {
  return input
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => a + '_' + b.toLowerCase())
    .replace(/[^A-Za-z0-9]+|_+/g, '_')
    .toLowerCase()
}

export { kebabCase, camelCase, upperCase, lowerCase, snakeCase }