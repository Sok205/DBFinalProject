import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import type { Part } from '../types/models';
import { Card, Badge } from './ui';
import LifecycleGauge from './LifecycleGauge';

interface PartCardProps {
  part: Part;
  onEdit?: (part: Part) => void;
  onDelete?: (part: Part) => void;
}

const PartCard: Component<PartCardProps> = (props) => {
  const getStatusBadge = () => {
    if (props.part.is_installed) {
      return <Badge variant="racing">Installed</Badge>;
    }
    return <Badge variant="success">Available</Badge>;
  };

  return (
    <Card hover class="group">
      {/* Card Header with racing stripe */}
      <div class="relative">
        {/* Racing stripe accent */}
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-f1-red" />

        <Card.Header class="pl-6">
          <div class="flex justify-between items-start gap-3">
            <div class="min-w-0">
              <h3 class="text-lg font-bold text-white truncate group-hover:text-f1-red transition-colors">
                {props.part.part_type}
              </h3>
              <p class="text-sm text-f1-silver font-mono mt-1 truncate">
                {props.part.serial_number}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </Card.Header>
      </div>

      <Card.Body>
        {/* Part Info */}
        <div class="space-y-3 mb-4">
          {props.part.manufacturer && (
            <div class="flex justify-between items-center text-sm">
              <span class="text-f1-silver/70 uppercase tracking-wider text-xs">Manufacturer</span>
              <span class="text-white font-semibold">{props.part.manufacturer}</span>
            </div>
          )}

          {props.part.fia_lifecycle_limit && (
            <div class="flex justify-between items-center text-sm">
              <span class="text-f1-silver/70 uppercase tracking-wider text-xs">FIA Limit</span>
              <span class="text-white font-semibold font-mono">
                {props.part.fia_lifecycle_limit.toLocaleString()} km
              </span>
            </div>
          )}
        </div>

        {/* Lifecycle Gauge */}
        {props.part.fia_lifecycle_limit && (
          <LifecycleGauge
            percentage={props.part.lifecycle_percentage}
            mileage={props.part.current_mileage}
            limit={props.part.fia_lifecycle_limit}
            compact
          />
        )}
      </Card.Body>

      <Card.Footer>
        <div class="flex items-center justify-between w-full">
          <A
            href={`/parts/${props.part.part_id}`}
            class="text-f1-red hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
          >
            View Details
          </A>
          <div class="flex gap-2">
            {props.onEdit && (
              <button
                onClick={() => props.onEdit?.(props.part)}
                class="text-f1-silver hover:text-white transition-colors p-1"
                title="Edit Part"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {props.onDelete && (
              <button
                onClick={() => props.onDelete?.(props.part)}
                class="text-f1-silver hover:text-status-critical transition-colors p-1"
                title="Delete Part"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default PartCard;
