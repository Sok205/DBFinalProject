import { Component } from 'solid-js';
import { useLocation } from '@solidjs/router';

const TopBar: Component = () => {
    const location = useLocation();

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/parts')) return 'Details > Part Inspection';
        if (path.startsWith('/cars')) return 'Garage > Car Setup';
        return 'Dashboard';
    };

    return (
        <header class="h-16 bg-f1-carbon/50 backdrop-blur-md border-b border-f1-carbon-light flex items-center justify-between px-6 sticky top-0 z-20">
            {/* Breadcrumbs */}
            <div class="flex items-center text-sm">
                <span class="text-f1-silver">Garage</span>
                <span class="mx-2 text-f1-silver/50">/</span>
                <span class="text-white font-medium">{getBreadcrumbs()}</span>
            </div>

            {/* Search / Actions */}
            <div class="flex items-center gap-4">
                <div class="relative">
                    <input
                        type="text"
                        placeholder="Global Search..."
                        class="bg-black/20 border border-f1-carbon-light rounded-md px-3 py-1.5 text-sm text-f1-silver focus:border-f1-red outline-none w-64 transition-colors"
                    />
                    <svg class="w-4 h-4 text-f1-silver/50 absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <button class="w-8 h-8 flex items-center justify-center text-f1-silver hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
