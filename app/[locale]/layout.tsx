import '@/styles/globals.css';
import { siteConfig } from '@/config/site.ts';
import { fontSans } from '@/config/fonts.ts';
import { Providers } from './providers.tsx';
import { Navbar } from '@/components/navbar.tsx';
import { Link } from '@heroui/link';
import clsx from 'clsx';
import { Metadata } from 'next';

// import DebugInitProvider from '@/components/DebugInitProvider';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // themeColor: [
  // 	{ media: "(prefers-color-scheme: light)", color: "white" },
  // 	{ media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    // apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
  // dashboard,
  login,
}: {
  children: React.ReactNode;
  // dashboard: React.ReactNode;
  login: React.ReactNode;
}) {
  const userLogged = true;
  // const userLogged = false ;

  const Home = () => {
    // return <>{login}</>
    return userLogged ? <>{children}</> : <>LOGIN{login}</>;
  };

  return (
    // <html lang="en" suppressHydrationWarning>
    //   <head />
    //   <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
    <Providers>
      <div className="relative flex flex-col h-screen">
        <Navbar />

        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          <Home />
        </main>

        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://nextui.org/"
            title="nextui.org homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">React</p>
          </Link>
        </footer>
      </div>
    </Providers>
    // </body>
    // </html>
  );
}
