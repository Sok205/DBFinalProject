import { Component, createSignal, For, Show, onMount } from 'solid-js';
import type { Part, Team } from '../types/models';
import { fetchTeams, fetchLifecycleWarnings } from '../services/api';
import { Select, Spinner, Badge } from '../components/ui';
import PartList from '../components/PartList';
import PartCard from '../components/PartCard';

const Dashboard: Component = () => {
  const [teams, setTeams] = createSignal<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = createSignal<number | null>(null);
  const [warnings, setWarnings] = createSignal<Part[]>([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const teamsResponse = await fetchTeams();
      setTeams(teamsResponse.results);

      const warningsResponse = await fetchLifecycleWarnings();
      setWarnings(warningsResponse);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-b from-f1-black to-f1-black-light">
      {/* Hero Header */}
      <header class="relative overflow-hidden">
        {/* Background Pattern */}
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0 checkered-pattern" />
        </div>

        {/* Gradient Overlay */}
        <div class="absolute inset-0 bg-gradient-to-br from-f1-red/20 via-transparent to-transparent" />

        {/* Content */}
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              {/* Logo/Brand */}
              <div class="flex items-center gap-3 mb-4">
                <div class="w-2 h-12 bg-f1-red" />
                <span class="text-f1-red font-bold text-sm uppercase tracking-[0.3em]">
                  Garage Management
                </span>
              </div>

              {/* Title */}
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight">
                F1 <span class="text-f1-red">Parts</span>
              </h1>
              <p class="mt-3 text-f1-silver text-lg max-w-xl">
                Part Lifecycle Tracking System
              </p>
            </div>

            {/* Stats (visible on larger screens) */}
            <div class="hidden sm:flex items-center gap-6">
              <div class="text-center">
                <div class="text-3xl font-black text-white">{teams().length}</div>
                <div class="text-xs text-f1-silver uppercase tracking-wider">Teams</div>
              </div>
              <div class="w-px h-12 bg-f1-carbon-light" />
              <div class="text-center">
                <div class="text-3xl font-black text-status-warning">{warnings().length}</div>
                <div class="text-xs text-f1-silver uppercase tracking-wider">Warnings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Racing Stripe */}
        <div class="h-1 bg-gradient-to-r from-f1-red via-f1-red to-transparent" />
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Show when={loading()}>
          <div class="flex flex-col items-center justify-center py-24">
            <Spinner size="lg" />
            <p class="mt-4 text-f1-silver">Loading dashboard...</p>
          </div>
        </Show>

        <Show when={!loading()}>
          {/* Team Selector */}
          <div class="mb-8">
            <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg p-4 sm:p-6 shadow-card">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-f1-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="text-sm font-semibold text-f1-silver uppercase tracking-wider">
                    Select Team
                  </span>
                </div>
                <Select
                  value={selectedTeam() || ''}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setSelectedTeam(value ? parseInt(value) : null);
                  }}
                  class="sm:w-64"
                >
                  <option value="">All Teams</option>
                  <For each={teams()}>
                    {(team) => (
                      <option value={team.team_id}>{team.name}</option>
                    )}
                  </For>
                </Select>
              </div>
            </div>
          </div>

          {/* Warnings Section */}
          <Show when={warnings().length > 0}>
            <section class="mb-10">
              {/* Section Header */}
              <div class="flex items-center gap-4 mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-1 h-8 bg-status-warning" />
                  <h2 class="text-2xl font-bold text-white uppercase tracking-wide">
                    Lifecycle Warnings
                  </h2>
                </div>
                <Badge variant="warning" pulse>
                  {warnings().length} Alert{warnings().length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <p class="text-f1-silver mb-6 flex items-center gap-2">
                <svg class="w-4 h-4 text-status-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Parts at or above 80% of their FIA lifecycle limit
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={warnings()}>
                  {(part) => <PartCard part={part} />}
                </For>
              </div>
            </section>
          </Show>

          {/* All Parts Section */}
          <section>
            {/* Section Header */}
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1 h-8 bg-f1-red" />
              <h2 class="text-2xl font-bold text-white uppercase tracking-wide">
                All Parts
              </h2>
            </div>

            <PartList />
          </section>
        </Show>
      </main>

      {/* Footer */}
      <footer class="border-t border-f1-carbon-light mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-1 h-4 bg-f1-red" />
              <span class="text-sm text-f1-silver">
                F1 Garage Management System
              </span>
            </div>
            <div class="text-xs text-f1-silver/50 uppercase tracking-wider">
              Part Lifecycle Tracking
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
