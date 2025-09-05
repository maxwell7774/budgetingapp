import { Outlet } from 'react-router';
import Navbar from './components/navbar.tsx';

function AppLayout() {
    return (
        <>
            <Navbar />
            <main className='flex justify-center items-start'>
                <div className='max-w-7xl m-4 md:m-8 w-full'>
                    <Outlet />
                </div>
            </main>
            <footer className='mx-4 md:mx-8 mb-4 md:mb-8'>
                <p className='bg-white dark:bg-slate-800 p-2 px-8 w-max mx-auto rounded-full flex items-center'>
                    <span className='me-1'>
                        Guppy Goals &bull; a product by
                    </span>
                    <span className='-me-0.5'>
                        <img className='w-4' src='/logo.svg' />
                    </span>
                    <a href='https://www.27actions.com' className='font-bold'>
                        27actions
                    </a>
                </p>
            </footer>
        </>
    );
}

export default AppLayout;
