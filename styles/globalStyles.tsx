import tw, { theme, globalStyles } from 'twin.macro'
import { globalCss } from '../stitches.config'

const customStyles = {
   '*': {
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
   },
   body: {
      WebkitTapHighlightColor: theme`colors.purple.500`,
      ...tw`antialiased bg-[#19191c]`,
   },
}

const styles = () => {
   globalCss(customStyles)()
   globalCss(globalStyles as Record<any, any>)()
}

export default styles
