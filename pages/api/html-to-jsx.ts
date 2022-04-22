import HTMLtoJSX from 'htmltojsx'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
   req: NextApiRequest,
   res: NextApiResponse<{ output: string }>
) {
   if (req.method === 'POST') {
      const { input = '' }: { input: string } = req.body
      const convertor = new HTMLtoJSX({ createClass: false })
      return res
         .status(200)
         .json({
            output: `export const MyComponent = () => (${convertor.convert(
               input
            )})`,
         })
   }
   return res.status(403)
}
