import html2pug from 'html2pug'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
   req: NextApiRequest,
   res: NextApiResponse<{ output: string }>
) {
   if (req.method === 'POST') {
      const { input = '' }: { input: string } = req.body
      return res.status(200).json({ output: html2pug(input, { tabs: true }) })
   }
   return res.status(403)
}
