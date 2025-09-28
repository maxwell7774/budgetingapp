'use client';
import { Button } from '@/components/ui/button';
import { Session } from '@/lib/auth/server';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { NavItem } from './navbar-client';
import { ThemeButton } from '../theme-button';

interface Props {
    session: Session | null;
}

export function NavbarContent({ session }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <nav>
            <div
                data-open={open}
                className="max-w-7xl min-w-max mx-auto flex items-center h-16 bg-white dark:bg-slate-800 md:bg-transparent
                    md:dark:bg-transparent data-[open=true]:rounded-t-4xl data-[open=false]:rounded-full data-[open=false]:delay-150"
            >
                <div className="p-2 h-full bg-white dark:bg-slate-800 rounded-full">
                    <Link
                        data-open={open}
                        className="h-full px-4 sm:px-8 text-xl font-bold flex items-center min-w-max rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                        href="/"
                    >
                        <img className="w-8 me-4" src="/fish.svg" />
                        Guppy Goals
                    </Link>
                </div>
                <div className="ms-auto h-full p-2">
                    <Button
                        variant="ghost"
                        className="h-full hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden hover:opacity-100 active:opacity-100"
                        onClick={() => setOpen(!open)}
                    >
                        <EllipsisIcon className="size-6 min-w-6 min-h-6" />
                    </Button>
                </div>
                <div
                    data-open={open}
                    className="ms-auto md:h-full md:!max-h-fit md:!flex items-center font-semibold gap-0.5 bg-white dark:bg-slate-800 md:rounded-full
                        absolute top-full left-0 right-0 md:static data-[open=true]:shadow-lg rounded-b-4xl
                        data-[open=true]:starting:max-h-0 data-[open=true]:max-h-96 data-[open=true]:block max-h-0 transition-all hidden overflow-hidden transition-discrete"
                >
                    <ul
                        data-open={open}
                        className="block md:flex items-center p-2 gap-0.5 h-full"
                    >
                        <NavItem href="/" setOpen={setOpen}>
                            Home
                        </NavItem>
                        <NavItem href="/about" setOpen={setOpen}>
                            About
                        </NavItem>
                        {session ? (
                            <>
                                <NavItem href="/budgets" setOpen={setOpen}>
                                    Budgets
                                </NavItem>
                                <NavItem href="/profile" setOpen={setOpen}>
                                    Profile
                                </NavItem>
                            </>
                        ) : (
                            <NavItem href="/login" setOpen={setOpen}>
                                Login
                            </NavItem>
                        )}
                        <li className="h-full">
                            <ThemeButton />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
