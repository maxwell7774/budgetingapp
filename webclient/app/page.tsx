import MoneyImage from '@/public/money.png';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-indigo-500 dark:bg-indigo-950 absolute inset-0 bottom-56 -z-1"></div>
            <div className="mt-8 md:mt-36 min-h-96 max-w-3x mx-auto">
                <h1 className="font-bold text-xl text-white dark:text-indigo-500">
                    Welcome to Guppy Goals!
                </h1>
                <p className="text-3xl mt-8 max-w-[35em] leading-18 tracking-wide">
                    This is your answer to
                    <span className="text-white dark:text-indigo-500 text-4xl font-bold tracking-wider">
                        {' SIMPLE '}
                    </span>
                    budgeting. This app is meant to make you
                    <span className="text-white dark:text-indigo-500 text-4xl font-bold tracking-wider">
                        {' DELIBRATE '}
                    </span>
                    about your money decisions. I hope you enjoy!
                </p>
            </div>
            <Image src={MoneyImage} alt="Picture of Money" priority />
        </div>
    );
}
