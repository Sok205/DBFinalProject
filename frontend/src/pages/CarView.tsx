import { Component, createSignal, Show, onMount } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import type { Car } from '../types/models';
import { fetchCar } from '../services/api';
import { Badge, Button, Spinner } from '../components/ui';
import CarPartHistory from '../components/CarPartHistory';

const CarView: Component = () => {
  const params = useParams();
  const [car, setCar] = createSignal<Car | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    if (!params.id) return;
    try {
      const carData = await fetchCar(parseInt(params.id));
      setCar(carData);
    } catch (err) {
      setError('Failed to load car details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const getStatusVariant = (status?: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'operational':
        return 'success';
      case 'maintenance':
      case 'service':
        return 'warning';
      case 'retired':
      case 'inactive':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-f1-black to-f1-black-light">
      {/* Navigation Bar */}
      <nav class="border-b border-f1-carbon-light bg-f1-carbon/50 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <A
            href="/"
            class="inline-flex items-center gap-2 text-f1-silver hover:text-f1-red transition-colors group"
          >
            <svg
              class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="font-semibold uppercase tracking-wider text-sm">Back to Dashboard</span>
          </A>
        </div>
      </nav>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex flex-col items-center justify-center py-32">
          <Spinner size="lg" />
          <p class="mt-4 text-f1-silver">Loading car details...</p>
        </div>
      </Show>

      {/* Error State */}
      <Show when={error()}>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div class="bg-status-critical/10 border border-status-critical/30 rounded-lg p-8 text-center">
            <svg class="w-16 h-16 text-status-critical mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 class="text-xl font-bold text-white mb-2">Error Loading Car</h2>
            <p class="text-status-critical mb-6">{error()}</p>
            <A href="/">
              <Button variant="secondary">Return to Dashboard</Button>
            </A>
          </div>
        </div>
      </Show>

      {/* Car Details */}
      <Show when={car()}>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header Card */}
          <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg overflow-hidden shadow-card mb-8">
            {/* Racing Header */}
            <div class="relative bg-gradient-to-r from-f1-red to-f1-red-dark p-6 sm:p-8">
              {/* Pattern overlay */}
              <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0 checkered-pattern" />
              </div>

              <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {/* Car Number Badge */}
                  <div class="inline-flex items-center gap-3 mb-4">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center">
                      <span class="text-3xl sm:text-4xl font-black text-f1-black">
                        {car()?.car_number}
                      </span>
                    </div>
                    <div>
                      <span class="text-white/70 text-sm uppercase tracking-wider block">Car</span>
                      <h1 class="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                        #{car()?.car_number}
                      </h1>
                    </div>
                  </div>

                  <p class="text-white/80 font-mono text-lg">
                    {car()?.chassis_number}
                  </p>
                </div>

                <div class="flex-shrink-0">
                  <Badge
                    variant={getStatusVariant(car()?.status)}
                    size="lg"
                  >
                    {car()?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div class="p-6 sm:p-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="bg-f1-black/50 rounded-lg p-4 border border-f1-carbon-light">
                  <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-2">
                    Team
                  </span>
                  <span class="text-xl font-bold text-white">
                    {car()?.team_name}
                  </span>
                </div>

                <div class="bg-f1-black/50 rounded-lg p-4 border border-f1-carbon-light">
                  <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-2">
                    Chassis Number
                  </span>
                  <span class="text-xl font-bold text-white font-mono">
                    {car()?.chassis_number}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Part History */}
          {params.id && (
            <div class="mb-8">
              <CarPartHistory carId={parseInt(params.id)} />
            </div>
          )}

          {/* Actions */}
          <div class="flex flex-wrap gap-4">
            <A href="/">
              <Button variant="ghost">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Button>
            </A>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default CarView;
