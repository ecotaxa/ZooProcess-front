import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZooProcess',
  description: 'ZooProcess Application',
}

// This is a minimal root layout that just passes through to locale-specific layouts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
