import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            type="checkbox"
            className={cn(
                "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

Checkbox.displayName = "Checkbox";
