import { Component, createSignal, For, Show, onMount } from 'solid-js';
import type { Part, Team, OpenF1Session } from '../types/models';
import { fetchTeams, fetchLifecycleWarnings, fetchF1Schedule } from '../services/api';
import { Select, Spinner, Badge } from '../components/ui';
import PartList from '../components/PartList';

const Dashboard: Component = () => {
  const [teams, setTeams] = createSignal<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = createSignal<number | null>(null);
  const [warnings, setWarnings] = createSignal<Part[]>([]);
  const [nextRace, setNextRace] = createSignal<OpenF1Session | null>(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const [teamsResponse, warningsResponse, scheduleResponse] = await Promise.all([
        fetchTeams(),
        fetchLifecycleWarnings(),
        fetchF1Schedule(2026)
      ]);

      setTeams(teamsResponse.results);
      setWarnings(warningsResponse);

      // Find next race
      const now = new Date();
      const futureRaces = scheduleResponse
        .filter(s => s.session_type === 'Race' && new Date(s.date_start) > now)
        .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());

      if (futureRaces.length > 0) {
        setNextRace(futureRaces[0]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  });

  const getDayCountdown = (dateString: string) => {
    const raceDate = new Date(dateString);
    const now = new Date();
    const diffTime = raceDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'TOMORROW';
    return `IN ${diffDays} DAYS`;
  };

  return (
    <div class="space-y-6">
      <Show when={loading()}>
        <div class="flex flex-col items-center justify-center py-24">
          <Spinner size="lg" />
          <p class="mt-4 text-f1-silver">Loading dashboard...</p>
        </div>
      </Show>

      <Show when={!loading()}>
        {/* Top Key Metrics Row */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Team Count */}
          <div class="bg-f1-carbon/80 border border-f1-carbon-light p-4 rounded-lg shadow-sm">
            <div class="text-f1-silver text-xs uppercase tracking-wider mb-1">Active Teams</div>
            <div class="text-3xl font-bold text-white">{teams().length}</div>
          </div>

          {/* Card 2: Warnings */}
          <div class="bg-f1-carbon/80 border border-f1-carbon-light p-4 rounded-lg shadow-sm relative overflow-hidden group">
            <div class="absolute inset-0 bg-status-warning/5 group-hover:bg-status-warning/10 transition-colors" />
            <div class="relative z-10">
              <div class="text-f1-silver text-xs uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Critical Alerts</span>
                <div class="w-2 h-2 rounded-full bg-status-warning animate-pulse" />
              </div>
              <div class="text-3xl font-bold text-status-warning">{warnings().length}</div>
            </div>
          </div>

          {/* Card 3: Next Race */}
          <div class="bg-f1-carbon/80 border border-f1-carbon-light p-4 rounded-lg shadow-sm">
            <div class="text-f1-silver text-xs uppercase tracking-wider mb-1">Next Grand Prix</div>
            <Show when={nextRace()} fallback={<div class="text-lg font-bold text-white italic">TBD</div>}>
              <div class="text-lg font-bold text-white truncate">{nextRace()?.location}</div>
              <div class="text-xs text-f1-red font-mono mt-1">
                {getDayCountdown(nextRace()!.date_start)}
              </div>
            </Show>
          </div>

          {/* Card 4: System Status */}
          <div class="bg-f1-carbon/80 border border-f1-carbon-light p-4 rounded-lg shadow-sm">
            <div class="text-f1-silver text-xs uppercase tracking-wider mb-1">System Status</div>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-2 h-2 rounded-full bg-status-success" />
              <span class="text-sm font-medium text-white">Online</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Data & Warnings */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">

          {/* Left Column (2/3): Main Content / Part List */}
          <div class="lg:col-span-2 flex flex-col gap-6">
            {/* Team Selector Toolbar */}
            <div class="flex items-center justify-between bg-f1-carbon border border-f1-carbon-light p-4 rounded-lg">
              <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-f1-silver">Filter Context:</span>
                <Select
                  value={selectedTeam() || ''}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setSelectedTeam(value ? parseInt(value) : null);
                  }}
                  class="w-48 text-sm py-1"
                >
                  <option value="">All Teams</option>
                  <For each={teams()}>
                    {(team) => (
                      <option value={team.team_id}>{team.name}</option>
                    )}
                  </For>
                </Select>
              </div>
              {/* Could add view toggles here */}
            </div>

            {/* Part List Container */}
            <div class="bg-f1-carbon border border-f1-carbon-light rounded-lg flex-1 overflow-hidden flex flex-col">
              <div class="p-4 border-b border-f1-carbon-light bg-black/20 flex items-center justify-between">
                <h3 class="font-bold text-white uppercase tracking-wide">Parts Inventory</h3>
                <div class="text-xs text-f1-silver">Real-time Data</div>
              </div>
              <div class="p-4 overflow-y-auto flex-1 custom-scrollbar">
                <PartList />
              </div>
            </div>
          </div>

          {/* Right Column (1/3): Alerts Feed */}
          <div class="lg:col-span-1 bg-f1-carbon border border-f1-carbon-light rounded-lg flex flex-col overflow-hidden">
            <div class="p-4 border-b border-f1-carbon-light bg-black/20 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="font-bold text-white uppercase tracking-wide">Lifecycle Warnings</h3>
              </div>
              <Badge variant="warning">{warnings().length}</Badge>
            </div>

            <div class="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              <Show when={warnings().length === 0}>
                <div class="text-center py-8 text-f1-silver/50 italic text-sm">
                  No active warnings. All systems nominal.
                </div>
              </Show>

              <For each={warnings()}>
                {(part) => (
                  <div class="bg-black/40 border border-status-warning/30 rounded p-3 hover:bg-black/60 transition-colors cursor-pointer">
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-xs font-bold text-status-warning uppercase">{part.part_type}</span>
                      <span class="text-xs text-f1-silver font-mono">{part.serial_number}</span>
                    </div>
                    <div class="w-full bg-f1-carbon-light h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        class="bg-status-warning h-full"
                        style={{ width: `${part.lifecycle_percentage || 0}%` }}
                      />
                    </div>
                    <div class="flex justify-between text-xs text-f1-silver">
                      <span>{part.current_mileage || 0} km</span>
                      <span>Limit: {part.fia_lifecycle_limit || 0} km</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

        </div>
      </Show>
    </div>
  );
};

export default Dashboard;
