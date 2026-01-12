import { Component, createSignal, onMount, For, Show } from 'solid-js';
import { fetchCars } from '../services/api';
import type { Car } from '../types/models';
import { Spinner, Badge } from '../components/ui';
import { A } from '@solidjs/router';

const CarsPage: Component = () => {
    const [cars, setCars] = createSignal<Car[]>([]);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        try {
            const response = await fetchCars();
            setCars(response.results);
        } catch (err) {
            console.error('Failed to load cars:', err);
        } finally {
            setLoading(false);
        }
    });

    return (
        <div class="space-y-6">
            <div>
                <h1 class="text-3xl font-black text-white uppercase tracking-tight">Race <span class="text-f1-red">Cars</span></h1>
                <p class="text-f1-silver mt-1 text-sm">Overview of all active chassis and their current status.</p>
            </div>

            <Show when={loading()}>
                <div class="py-24 flex justify-center">
                    <Spinner size="lg" />
                </div>
            </Show>

            <Show when={!loading()}>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <For each={cars()}>
                        {(car) => (
                            <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg overflow-hidden hover:border-f1-red/50 transition-colors group">
                                <div class="p-6">
                                    <div class="flex justify-between items-start mb-6">
                                        <div class="w-12 h-12 bg-white rounded flex items-center justify-center text-2xl font-black text-f1-black">
                                            {car.car_number}
                                        </div>
                                        <Badge variant={car.status === 'Operational' ? 'success' : 'warning'}>
                                            {car.status}
                                        </Badge>
                                    </div>

                                    <h3 class="text-xl font-bold text-white group-hover:text-f1-red transition-colors mb-1">
                                        Chassis {car.chassis_number}
                                    </h3>
                                    <p class="text-f1-silver text-sm mb-6">{car.team_name}</p>

                                    <A
                                        href={`/cars/${car.car_id}`}
                                        class="block w-full text-center py-2 bg-f1-carbon-light hover:bg-f1-red text-white text-sm font-bold uppercase tracking-wider rounded transition-colors"
                                    >
                                        Enter Garage
                                    </A>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
};

export default CarsPage;
