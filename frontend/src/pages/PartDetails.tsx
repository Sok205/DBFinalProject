import { Component, createSignal, Show, onMount } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import type { Part } from '../types/models';
import { fetchPart } from '../services/api';
import { Badge, Button, Spinner } from '../components/ui';
import LifecycleGauge from '../components/LifecycleGauge';

const PartDetails: Component = () => {
  const params = useParams();
  const [part, setPart] = createSignal<Part | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    if (!params.id) return;
    try {
      const partData = await fetchPart(parseInt(params.id));
      setPart(partData);
    } catch (err) {
      setError('Failed to load part details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-b from-f1-black to-f1-black-light">
      {/* Navigation Bar */}
      <nav class="border-b border-f1-carbon-light bg-f1-carbon/50 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
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
          <p class="mt-4 text-f1-silver">Loading part details...</p>
        </div>
      </Show>

      {/* Error State */}
      <Show when={error()}>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div class="bg-status-critical/10 border border-status-critical/30 rounded-lg p-8 text-center">
            <svg class="w-16 h-16 text-status-critical mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 class="text-xl font-bold text-white mb-2">Error Loading Part</h2>
            <p class="text-status-critical mb-6">{error()}</p>
            <A href="/">
              <Button variant="secondary">Return to Dashboard</Button>
            </A>
          </div>
        </div>
      </Show>

      {/* Part Details */}
      <Show when={part()}>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header Card */}
          <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg overflow-hidden shadow-card mb-8">
            {/* Racing Stripe Header */}
            <div class="relative bg-gradient-to-r from-f1-red to-f1-red-dark p-6 sm:p-8">
              {/* Pattern overlay */}
              <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0 checkered-pattern" />
              </div>

              <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-white/70 text-sm uppercase tracking-wider">Part Type</span>
                  </div>
                  <h1 class="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                    {part()?.part_type}
                  </h1>
                  <p class="mt-2 text-white/80 font-mono text-lg">
                    {part()?.serial_number}
                  </p>
                </div>

                <div class="flex-shrink-0">
                  <Badge
                    variant={part()?.is_installed ? 'racing' : 'success'}
                    size="lg"
                  >
                    {part()?.is_installed ? 'Installed' : 'Available'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div class="p-6 sm:p-8">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {part()?.manufacturer && (
                  <div class="bg-f1-black/50 rounded-lg p-4 border border-f1-carbon-light">
                    <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-2">
                      Manufacturer
                    </span>
                    <span class="text-xl font-bold text-white">
                      {part()?.manufacturer}
                    </span>
                  </div>
                )}

                <Show when={part()?.fia_lifecycle_limit}>
                  <div class="bg-f1-black/50 rounded-lg p-4 border border-f1-carbon-light">
                    <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-2">
                      FIA Lifecycle Limit
                    </span>
                    <span class="text-xl font-bold text-white font-mono">
                      {part()!.fia_lifecycle_limit!.toLocaleString()} km
                    </span>
                  </div>
                </Show>

                {part()?.current_mileage !== undefined && (
                  <div class="bg-f1-black/50 rounded-lg p-4 border border-f1-carbon-light">
                    <span class="block text-xs text-f1-silver/70 uppercase tracking-wider mb-2">
                      Current Mileage
                    </span>
                    <span class="text-xl font-bold text-white font-mono">
                      {part()?.current_mileage?.toLocaleString() || 'N/A'} km
                    </span>
                  </div>
                )}
              </div>

              {/* Lifecycle Gauge */}
              {part()?.fia_lifecycle_limit && part() && (
                <div>
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-1 h-6 bg-f1-red" />
                    <h2 class="text-lg font-bold text-white uppercase tracking-wider">
                      Lifecycle Analysis
                    </h2>
                  </div>
                  <LifecycleGauge
                    percentage={part()!.lifecycle_percentage}
                    mileage={part()!.current_mileage}
                    limit={part()!.fia_lifecycle_limit}
                  />
                </div>
              )}
            </div>
          </div>

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

export default PartDetails;
