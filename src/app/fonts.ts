import localFont from 'next/font/local'

export const snatchedFont = localFont({
  src: [
    {
      path: './fonts/Snacthed.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Snacthed Oblique.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-snatched'
})

export const sportSolidFont = localFont({
  src: './fonts/SportSolid.woff',
  variable: '--font-sport-solid'
}) 