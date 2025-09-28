'use client';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeButton() {
    const { theme, setTheme } = useTheme();

    const changeTheme = function () {
        if (theme == 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    return (
        <Button
            variant="ghost"
            className="h-11 md:h-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:opacity-100 active:opacity-100 w-full md:w-max"
            onClick={changeTheme}
        >
            <MoonIcon className="size-6 hidden dark:block" />
            <SunIcon className="size-6 dark:hidden" />
        </Button>
    );
}
