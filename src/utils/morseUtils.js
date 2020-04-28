const TEXT_TO_MORSE_REGEX = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#]/g;
const MORSE_TO_TEXT_REGEX = /[!$%^&*()_+|~=`{}[\]:";'<>?,@#0-9a-z]/gi;

const validate = match => value => {
  const chars = value
    .replace(/\n/g, ' ')
    .match(match, '')
  if (chars && chars.length > 0) {
    return (
      `Invalid character${
      chars.length === 1 ? '' : 's'
      } will be omitted!: ${chars.join(' ')}`
    )
  }
  return ''
}

const validateTextToMorse = value => validate(TEXT_TO_MORSE_REGEX)(value);
const validateMorseToText = value => validate(MORSE_TO_TEXT_REGEX)(value);

const textToMorse = value => {
  const morse = {
    a: [0, 1],
    b: [1, 0, 0, 0],
    c: [1, 0, 1, 0],
    d: [1, 0, 0],
    e: [0],
    f: [0, 0, 1, 0],
    g: [1, 1, 0],
    h: [0, 0, 0, 0],
    i: [0, 0],
    j: [0, 1, 1, 1],
    k: [1, 0, 1],
    l: [0, 1, 0, 0],
    m: [1, 1],
    n: [1, 0],
    o: [1, 1, 1],
    p: [0, 1, 1, 0],
    q: [1, 1, 0, 1],
    r: [0, 1, 0],
    s: [0, 0, 0],
    t: [1],
    u: [0, 0, 1],
    v: [0, 0, 0, 1],
    w: [0, 1, 1],
    x: [1, 0, 0, 1],
    y: [1, 0, 1, 1],
    z: [1, 1, 0, 0]
  }

  const arrayOfWords = value
    .replace(/\n/g, ' ')
    .replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#]/g, '')
    .split(' ')
    .map(word => word.toLowerCase())
    .filter(Boolean)
  let morseWord = []
  arrayOfWords.map(word => {
    let parsed = [...word.trim()]
      .filter(Boolean)
      .map(letter =>
        morse[letter].map(i => (i === 0 ? '.' : '-')).join('')
      )
    return morseWord.push(parsed.join(' '))
  })
  return morseWord.join(' / ')
}

const morseToText = value => {
  const morse = {
    '01': 'a',
    '1000': 'b',
    '1010': 'c',
    '100': 'd',
    '0': 'e',
    '0010': 'f',
    '110': 'g',
    '0000': 'h',
    '00': 'i',
    '0111': 'j',
    '101': 'k',
    '0100': 'l',
    '11': 'm',
    '10': 'n',
    '111': 'o',
    '0110': 'p',
    '1101': 'q',
    '010': 'r',
    '000': 's',
    '1': 't',
    '001': 'u',
    '0001': 'v',
    '011': 'w',
    '1001': 'x',
    '1011': 'y',
    '1100': 'z'
  }

  const splitToWords = code => {
    return code
      .replace(/\n/g, ' ')
      .split('/')
      .map(word => word.split(' ').filter(Boolean))
  }

  const convertWordsToBinaryArray = words => {
    return words.map(word => {
      return word.map(letter =>
        letter.split('').map(code => (code === '-' ? 1 : 0))
      )
    })
  }

  const joinBinaryWordArray = binary => {
    return binary.map(word => word.map(letter => letter.join('')))
  }

  const convertBinaryToText = (binaryWords, morse) => {
    return binaryWords
      .map(word => word.map(letter => morse[letter]).join(''))
      .join(' ')
  }

  const words = splitToWords(value)
  const binaryArray = convertWordsToBinaryArray(words)
  const binaryWords = joinBinaryWordArray(binaryArray)
  const parsedText = convertBinaryToText(binaryWords, morse)
  return parsedText
}

export { validateTextToMorse, validateMorseToText, textToMorse, morseToText }