import { Providers } from '../providers';
import { Navbar } from '@/components/navbar';
import { Link } from '@heroui/link';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';

export default function VignettesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />

            {/* 💥 Ici on utilise toute la largeur */}
            <main className="w-full px-4 pt-16 flex-grow overflow-x-auto">{children}</main>

            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://nextui.org/"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">NextUI</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
