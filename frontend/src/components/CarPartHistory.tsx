import { Component, createSignal, For, Show, onMount } from 'solid-js';
import type { CarPart } from '../types/models';
import { fetchCarPartHistory } from '../services/api';
import { Badge, Spinner } from './ui';

interface CarPartHistoryProps {
  carId: number;
}

const CarPartHistory: Component<CarPartHistoryProps> = (props) => {
  const [history, setHistory] = createSignal<CarPart[]>([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const response = await fetchCarPartHistory(props.carId);
      setHistory(response.results);
    } catch (err) {
      console.error('Failed to load car part history:', err);
    } finally {
      setLoading(false);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLifecycleColor = (percentage?: number) => {
    if (!percentage) return 'text-f1-silver';
    if (percentage >= 90) return 'text-status-critical';
    if (percentage >= 70) return 'text-status-warning';
    return 'text-status-good';
  };

  return (
    <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg overflow-hidden shadow-card">
      {/* Header */}
      <div class="px-6 py-4 border-b border-f1-carbon-light bg-f1-black/50">
        <div class="flex items-center gap-3">
          <div class="w-1 h-6 bg-f1-red" />
          <h3 class="text-lg font-bold text-white uppercase tracking-wider">
            Part Installation History
          </h3>
        </div>
      </div>

      {/* Content */}
      <div class="p-6">
        <Show when={loading()}>
          <div class="flex flex-col items-center justify-center py-12">
            <Spinner size="md" />
            <p class="mt-4 text-f1-silver">Loading history...</p>
          </div>
        </Show>

        <Show when={!loading()}>
          {/* Timeline */}
          <div class="relative pl-8">
            {/* Timeline line */}
            <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-f1-carbon-light" />

            <For each={history()}>
              {(carPart) => (
                <div class="relative pb-8 last:pb-0">
                  {/* Timeline marker */}
                  <div
                    class={`absolute -left-5 top-1 w-4 h-4 rounded-full border-2 z-10 ${
                      carPart.is_active
                        ? 'bg-status-good border-status-good shadow-[0_0_10px_rgba(0,210,106,0.5)]'
                        : 'bg-f1-carbon border-f1-silver'
                    }`}
                  />

                  {/* Content Card */}
                  <div
                    class={`bg-f1-black/50 rounded-lg border overflow-hidden transition-all duration-200 hover:border-f1-red/50 ${
                      carPart.is_active ? 'border-status-good/30' : 'border-f1-carbon-light'
                    }`}
                  >
                    {/* Part Header */}
                    <div class="px-4 py-3 border-b border-f1-carbon-light/50 flex justify-between items-center">
                      <span class="font-bold text-white">{carPart.part_type}</span>
                      {carPart.is_active && (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                    </div>

                    {/* Part Details */}
                    <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-1">
                          Serial
                        </span>
                        <span class="text-sm text-white font-mono">
                          {carPart.serial_number}
                        </span>
                      </div>

                      {carPart.manufacturer && (
                        <div>
                          <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-1">
                            Manufacturer
                          </span>
                          <span class="text-sm text-white">
                            {carPart.manufacturer}
                          </span>
                        </div>
                      )}

                      <div>
                        <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-1">
                          Installed
                        </span>
                        <span class="text-sm text-white">
                          {formatDate(carPart.installed_at)}
                        </span>
                      </div>

                      {carPart.removed_at && (
                        <div>
                          <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-1">
                            Removed
                          </span>
                          <span class="text-sm text-white">
                            {formatDate(carPart.removed_at)}
                          </span>
                        </div>
                      )}

                      {carPart.mileage && (
                        <div>
                          <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-1">
                            Mileage
                          </span>
                          <span class="text-sm text-white font-mono">
                            {carPart.mileage.toLocaleString()} km
                          </span>
                        </div>
                      )}

                      {carPart.lifecycle_percentage !== undefined && (
                        <div>
                          <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-1">
                            Lifecycle
                          </span>
                          <span class={`text-sm font-bold ${getLifecycleColor(carPart.lifecycle_percentage)}`}>
                            {carPart.lifecycle_percentage.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Empty State */}
          <Show when={history().length === 0}>
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-f1-silver/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-lg font-semibold text-white mb-2">No History Available</h4>
              <p class="text-f1-silver">No part installation records found for this car.</p>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default CarPartHistory;
