import AboutUsImage from '@/public/about-us.webp';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="grid md:grid-cols-2 gap-16">
            <Image
                className="mt-4 md:mt-26 rounded-3xl"
                src={AboutUsImage}
                alt="Picture of about us"
                priority
            />
            <div className="bg-indigo-500 dark:bg-indigo-950 absolute inset-0 bottom-56 -z-1"></div>
            <div className="mt-8 md:mt-36 min-h-96 max-w-3x mx-auto">
                <h1 className="font-bold text-xl text-white dark:text-indigo-500">
                    About Us!
                </h1>
                <p className="text-3xl mt-8 max-w-[35em] leading-18 tracking-wide">
                    I created Guppy Goals because I wanted a budgeting app that
                    was simple. That's all.
                </p>
            </div>
        </div>
    );
}
