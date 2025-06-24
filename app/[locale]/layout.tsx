import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@heroui/link";
import clsx from "clsx";

// import DebugInitProvider from '@/components/DebugInitProvider';

import  { NextIntlClientProvider, useLocale } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		// apple: "/apple-touch-icon.png",
	},
};



export default async function RootLayout({
	children,
	// dashboard,
	login
}: {
	children: React.ReactNode;
	// dashboard: React.ReactNode;
	login: React.ReactNode;
}) {

	const userLogged = true ; 
	// const userLogged = false ;

	const Home = () => {
		// return <>{login}</>
		return userLogged ? <>{children}</> : <>LOGIN{login}</>
	}	

	const locale = await getLocale();
	const messages = await getMessages()
	//  const locale =  useLocale();

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<NextIntlClientProvider messages={messages}  locale={locale} >
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />

						<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
							<Home/>
						</main>

						<footer className="w-full flex items-center justify-center py-3">
							<Link
								isExternal
								className="flex items-center gap-1 text-current"
								href="https://nextui.org/"
								title="nextui.org homepage"
							>
								<span className="text-default-600">Powered by</span>
								<p className="text-primary">NextUI</p>
							</Link>
						</footer>
					</div>
				</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
