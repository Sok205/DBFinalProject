import { Component } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { cn } from '../lib/utils';

const SidebarItem: Component<{ href: string; icon: any; label: string }> = (props) => {
    const location = useLocation();
    const isActive = () => location.pathname === props.href;

    return (
        <A
            href={props.href}
            class={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative",
                isActive()
                    ? "text-white bg-white/5"
                    : "text-f1-silver hover:text-white hover:bg-white/5"
            )}
        >
            {isActive() && (
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-f1-red" />
            )}
            <div class={cn("w-5 h-5", isActive() ? "text-f1-red" : "text-f1-silver")}>
                {props.icon}
            </div>
            <span>{props.label}</span>
        </A>
    );
};

const Sidebar: Component = () => {
    return (
        <aside class="w-64 bg-f1-carbon border-r border-f1-carbon-light flex flex-col fixed inset-y-0 left-0 z-30">
            {/* Brand */}
            <div class="h-16 flex items-center px-6 border-b border-f1-carbon-light bg-black/20">
                <div class="w-1.5 h-8 bg-f1-red mr-3" />
                <span class="text-lg font-bold text-white uppercase tracking-wider">
                    F1 Garage
                </span>
            </div>

            {/* Navigation */}
            <nav class="flex-1 py-6 flex flex-col gap-1">
                <SidebarItem
                    href="/"
                    label="Dashboard"
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    }
                />
                <SidebarItem
                    href="/parts"
                    label="Parts Inventory"
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                />
                <SidebarItem
                    href="/cars"
                    label="Race Cars"
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    }
                />
                <SidebarItem
                    href="/teams"
                    label="Teams"
                    icon={
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />
            </nav>

            {/* User / Team Context */}
            <div class="p-4 border-t border-f1-carbon-light">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-f1-red flex items-center justify-center text-white font-bold text-xs">
                        RB
                    </div>
                    <div>
                        <div class="text-sm font-medium text-white">Red Bull Racing</div>
                        <div class="text-xs text-f1-silver">Chief Mechanic</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
