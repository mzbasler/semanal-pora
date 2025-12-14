import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {}

export function AppContent({ children, ...props }: AppContentProps) {
    return (
        <main
            className="flex h-full w-full flex-1 flex-col gap-4"
            {...props}
        >
            {children}
        </main>
    );
}
