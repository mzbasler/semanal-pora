'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleGroupContextValue {
    value?: string;
    onValueChange?: (value: string) => void;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({});

interface ToggleGroupProps {
    type?: 'single';
    value?: string;
    onValueChange?: (value: string) => void;
    variant?: 'default' | 'outline';
    className?: string;
    children: React.ReactNode;
}

function ToggleGroup({
    value,
    onValueChange,
    variant = 'default',
    className,
    children,
}: ToggleGroupProps) {
    return (
        <ToggleGroupContext.Provider value={{ value, onValueChange }}>
            <div className={cn('flex items-center gap-1', className)}>
                {children}
            </div>
        </ToggleGroupContext.Provider>
    );
}

interface ToggleGroupItemProps {
    value: string;
    className?: string;
    children: React.ReactNode;
}

function ToggleGroupItem({ value, className, children }: ToggleGroupItemProps) {
    const context = React.useContext(ToggleGroupContext);
    const isSelected = context.value === value;

    return (
        <button
            type="button"
            data-state={isSelected ? 'on' : 'off'}
            onClick={() => context.onValueChange?.(isSelected ? '' : value)}
            className={cn(
                'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                className
            )}
        >
            {children}
        </button>
    );
}

export { ToggleGroup, ToggleGroupItem };
