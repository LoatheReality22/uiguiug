import './globals.css'

export const metadata = {
  title: 'Hyam Movement - Client Portal',
  description: 'Advocacy services and client management portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
