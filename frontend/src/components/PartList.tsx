import { Component, createSignal, For, Show, onMount } from 'solid-js';
import type { Part, PartFilters } from '../types/models';
import { fetchParts } from '../services/api';
import { Button, Input, Spinner } from './ui';
import PartCard from './PartCard';

const PartList: Component = () => {
  const [parts, setParts] = createSignal<Part[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [filters, setFilters] = createSignal<PartFilters>({});
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedType, setSelectedType] = createSignal('');
  const [selectedManufacturer, setSelectedManufacturer] = createSignal('');

  const loadParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchParts(filters());
      setParts(response.results);
    } catch (err) {
      setError('Failed to load parts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    loadParts();
  });

  const handleSearch = () => {
    setFilters({
      ...filters(),
      search: searchTerm(),
      part_type: selectedType(),
      manufacturer: selectedManufacturer(),
    });
    loadParts();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedManufacturer('');
    setFilters({});
    loadParts();
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Bar */}
      <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg p-4 sm:p-6 mb-6 shadow-card">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Search by serial, type..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            fullWidth
          />

          <Input
            type="text"
            placeholder="Filter by type"
            value={selectedType()}
            onInput={(e) => setSelectedType(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            fullWidth
          />

          <Input
            type="text"
            placeholder="Filter by manufacturer"
            value={selectedManufacturer()}
            onInput={(e) => setSelectedManufacturer(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            fullWidth
          />

          <div class="flex gap-2">
            <Button onClick={handleSearch} variant="primary" fullWidth>
              Search
            </Button>
            <Button onClick={handleReset} variant="ghost">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      <Show when={loading()}>
        <div class="flex flex-col items-center justify-center py-16">
          <Spinner size="lg" />
          <p class="mt-4 text-f1-silver">Loading parts...</p>
        </div>
      </Show>

      {/* Error State */}
      <Show when={error()}>
        <div class="bg-status-critical/10 border border-status-critical/30 rounded-lg p-6 text-center">
          <svg class="w-12 h-12 text-status-critical mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-status-critical font-semibold">{error()}</p>
          <Button onClick={loadParts} variant="danger" class="mt-4">
            Try Again
          </Button>
        </div>
      </Show>

      {/* Results */}
      <Show when={!loading() && !error()}>
        {/* Count */}
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-4 bg-f1-red" />
          <span class="text-sm text-f1-silver">
            <span class="text-white font-bold">{parts().length}</span>
            {' '}part{parts().length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={parts()}>
            {(part) => <PartCard part={part} />}
          </For>
        </div>

        {/* Empty State */}
        <Show when={parts().length === 0}>
          <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg p-12 text-center">
            <svg class="w-16 h-16 text-f1-silver/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 class="text-xl font-bold text-white mb-2">No Parts Found</h3>
            <p class="text-f1-silver mb-6">Try adjusting your search filters</p>
            <Button onClick={handleReset} variant="secondary">
              Clear Filters
            </Button>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default PartList;
