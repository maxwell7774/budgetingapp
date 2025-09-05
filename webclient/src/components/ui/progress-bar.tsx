import { useEffect, useState } from 'react';

interface Props {
    label?: string;
    value?: number;
    target?: number;
}

export function ProgressBar({ label = '', value = 0, target = 0 }: Props) {
    const percentage = target ? Math.round((value / target) * 100) : 0;
    const clamped = Math.max(0, Math.min(percentage, 100));
    const showLabel = !!label;
    const displayText = label || 'Loading...';

    const [currentPercent, setCurrentPercent] = useState(0);

    useEffect(() => {
        setCurrentPercent(clamped);
    }, [clamped]);

    return (
        <div className='relative rounded-full overflow-hidden bg-indigo-300 dark:bg-indigo-900'>
            {/* Invisible text to set dimensions */}
            <div className='px-3 py-1 text-sm font-bold invisible'>
                {displayText}
            </div>

            {/* Filled background */}
            <div
                className='absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-500'
                style={{ width: `${currentPercent}%` }}
            >
            </div>

            {showLabel && (
                <div className='absolute inset-0 z-10 flex items-center px-3 text-sm font-bold text-white transition-all duration-500'>
                    {label}
                </div>
            )}
        </div>
    );
}
