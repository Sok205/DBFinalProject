import { Component, ParentProps } from 'solid-js';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const MainLayout: Component<ParentProps> = (props) => {
    return (
        <div class="min-h-screen bg-f1-black-light text-f1-silver flex font-sans">
            <Sidebar />

            <div class="flex-1 flex flex-col pl-64 transition-all duration-300">
                <TopBar />

                <main class="flex-1 p-6 relative">
                    {/* Background Pattern */}
                    <div class="absolute inset-0 opacity-[0.02] pointer-events-none">
                        <div class="absolute inset-0 checkered-pattern" />
                    </div>

                    <div class="relative z-10">
                        {props.children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
