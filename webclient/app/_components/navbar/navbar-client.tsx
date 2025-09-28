'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
    href: string;
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
}

export function NavItem({ href, children, setOpen }: NavItemProps) {
    const path = usePathname();
    const base: string =
        'flex items-center justify-center rounded-full h-11 md:h-full px-5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all';

    return (
        <li className="h-full">
            <Link
                href={href}
                onClick={() => setOpen(false)}
                className={
                    href === path
                        ? base + ' bg-slate-200 dark:bg-slate-700'
                        : base
                }
            >
                {children}
            </Link>
        </li>
    );
}
