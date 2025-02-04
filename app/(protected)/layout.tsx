import { SessionProvider } from "next-auth/react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

        <SessionProvider>
          {children}
        </SessionProvider>
   
  )

  // return (
  //   <html lang="en">
  //     <body>
  //       <SessionProvider>
  //         {children}
  //       </SessionProvider>
  //     </body>
  //   </html>
  // )
}