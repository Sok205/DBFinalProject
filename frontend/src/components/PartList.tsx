import { Component, createSignal, For, Show, onMount } from 'solid-js';
import type { Part, PartFilters } from '../types/models';
import { fetchParts, createPart, updatePart, deletePart } from '../services/api';
import { Button, Input, Spinner, Modal } from './ui';
import PartCard from './PartCard';
import PartForm from './PartForm';

const PartList: Component = () => {
  const [parts, setParts] = createSignal<Part[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [filters, setFilters] = createSignal<PartFilters>({});
  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedType, setSelectedType] = createSignal('');
  const [selectedManufacturer, setSelectedManufacturer] = createSignal('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingPart, setEditingPart] = createSignal<Part | undefined>(undefined);
  const [isSaving, setIsSaving] = createSignal(false);

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

  const handleAdd = () => {
    setEditingPart(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = async (part: Part) => {
    if (!confirm(`Are you sure you want to delete ${part.part_type} ${part.serial_number}?`)) {
      return;
    }
    try {
      await deletePart(part.part_id);
      await loadParts();
    } catch (err) {
      console.error('Failed to delete part:', err);
      // Could add toast notification here
    }
  };

  const handleSave = async (data: Partial<Part>) => {
    setIsSaving(true);
    try {
      if (editingPart()) {
        await updatePart(editingPart()!.part_id, data);
      } else {
        await createPart(data);
      }
      setIsModalOpen(false);
      await loadParts();
    } catch (err) {
      console.error('Failed to save part:', err);
      // Could add toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="h-full">
      {/* Filter Bar */}
      <div class="bg-f1-carbon/50 border border-f1-carbon-light rounded-lg p-6 mb-8 shadow-card backdrop-blur-sm">
        <div class="flex flex-col gap-6">
          <div class="flex flex-wrap items-end gap-6">
            <div class="flex-1 min-w-[240px]">
              <Input
                label="Search"
                type="text"
                placeholder="Serial number or type..."
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                fullWidth
              />
            </div>

            <div class="flex-1 min-w-[200px]">
              <Input
                label="Part Type"
                type="text"
                placeholder="e.g. Front Wing"
                value={selectedType()}
                onInput={(e) => setSelectedType(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                fullWidth
              />
            </div>

            <div class="flex-1 min-w-[200px]">
              <Input
                label="Manufacturer"
                type="text"
                placeholder="e.g. Honda"
                value={selectedManufacturer()}
                onInput={(e) => setSelectedManufacturer(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                fullWidth
              />
            </div>

            <div class="flex items-center gap-3">
              <Button onClick={handleSearch} variant="primary" size="md" class="min-w-[100px]">
                Search
              </Button>
              <Button onClick={handleReset} variant="ghost" size="md" class="min-w-[100px]">
                Reset
              </Button>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-f1-carbon-light">
            <Button onClick={handleAdd} variant="secondary">
              + Add New Part
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
            {(part) => (
              <PartCard
                part={part}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </For>
        </div>

        {/* Empty State */}
        <Show when={parts().length === 0}>
          <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg p-12 text-center">
            <svg class="w-16 h-16 text-f1-silver/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 class="text-xl font-bold text-white mb-2">No Parts Found</h3>
            <p class="text-f1-silver mb-6">Try adjusting your search filters or add a new part</p>
            <div class="flex gap-3 justify-center">
              <Button onClick={handleReset} variant="secondary">
                Clear Filters
              </Button>
              <Button onClick={handleAdd} variant="primary">
                Add New Part
              </Button>
            </div>
          </div>
        </Show>
      </Show>

      {/* CRUD Modal */}
      <Modal
        isOpen={isModalOpen()}
        onClose={() => setIsModalOpen(false)}
        title={editingPart() ? 'Edit Part' : 'Add New Part'}
      >
        <PartForm
          initialData={editingPart()}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSaving()}
        />
      </Modal>
    </div>
  );
};

export default PartList;
