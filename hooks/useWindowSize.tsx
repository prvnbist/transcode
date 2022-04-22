import React from 'react'

export const useWindowSize = () => {
   const [windowSize, setWindowSize] = React.useState<{
      height: undefined | number
      width: undefined | number
   }>({
      width: undefined,
      height: undefined,
   })
   React.useEffect(() => {
      function handleResize() {
         setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
         })
      }
      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
   }, [])
   return windowSize
}
