import type { Metadata } from 'next';
import {
    Geist,
    Geist_Mono,
    Press_Start_2P,
    Roboto_Slab,
    Saira,
    Saira_Stencil_One,
} from 'next/font/google';
import './globals.css';
import Navbar from './_components/navbar';
import { ThemeProvider } from './_components/theme-provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// });

// const robotoSlab = Roboto_Slab({
//     variable: '--font-roboto-slab',
//     subsets: ['latin'],
// });

// const pressStart = Press_Start_2P({
//     subsets: ['latin'],
//     weight: '400',
//     display: 'swap', // Optional: Improves loading behavior
//     variable: '--font-press-start', // Optional: For CSS variables if using Tailwind or custom CSS
// });

const saira = Saira({
    variable: '--font-saira',
    subsets: ['latin'],
});

// const sairaStencil = Saira_Stencil_One({
//     variable: '--font-saira-stencil',
//     subsets: ['latin'],
//     weight: '400',
// });

export const metadata: Metadata = {
    title: 'Guppy Goals',
    description: 'Your simple budgeting app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/fish.svg" sizes="any" />
            </head>
            <body
                className={`${saira.className} ${geistSans.className} antialiased font-medium relative grid grid-rows-[max-content_1fr_max-content] min-h-screen`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="flex justify-center items-start">
                        <div className="max-w-7xl m-4 md:m-8 w-full">
                            {children}
                        </div>
                    </main>
                    <footer className="mx-4 md:mx-8 mb-4 md:mb-8">
                        <p className="bg-white dark:bg-slate-800 p-2 px-8 w-max mx-auto rounded-full flex items-center">
                            <span className="me-1">
                                Guppy Goals &bull; a product by
                            </span>
                            <span className="-me-0.5">
                                <img className="w-4" src="/logo.svg" />
                            </span>
                            <a
                                href="https://www.27actions.com"
                                className="font-bold"
                            >
                                27actions
                            </a>
                        </p>
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
