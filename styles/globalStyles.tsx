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
   select: {
      appearance: 'none',
      msAppearance: 'none',
      MozAppearance: 'none',
      WebkitAppearance: 'none',
      padding: '8px 32px 8px 16px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'calc(100% - 12px) center !important',
      backgroundImage:
         "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' height='16' width='16' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e\")",
   },
}

const styles = () => {
   globalCss(customStyles)()
   globalCss(globalStyles as Record<any, any>)()
}

export default styles
