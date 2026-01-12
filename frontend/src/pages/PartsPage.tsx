import { Component } from 'solid-js';
import PartList from '../components/PartList';

const PartsPage: Component = () => {
    return (
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-black text-white uppercase tracking-tight">Parts <span class="text-f1-red">Inventory</span></h1>
                    <p class="text-f1-silver mt-1 text-sm">Manage and track all FIA regulated components.</p>
                </div>
            </div>

            <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg overflow-hidden flex flex-col min-h-[600px]">
                <div class="p-4 border-b border-f1-carbon-light bg-black/20">
                    <h3 class="font-bold text-white uppercase tracking-wide text-sm">Full Inventory List</h3>
                </div>
                <div class="p-6">
                    <PartList />
                </div>
            </div>
        </div>
    );
};

export default PartsPage;
