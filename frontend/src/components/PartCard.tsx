import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import type { Part } from '../types/models';
import { Card, Badge } from './ui';
import LifecycleGauge from './LifecycleGauge';

interface PartCardProps {
  part: Part;
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
        <A
          href={`/parts/${props.part.part_id}`}
          class="flex items-center justify-between w-full text-f1-red hover:text-white transition-colors group/link"
        >
          <span class="text-sm font-semibold uppercase tracking-wider">View Details</span>
          <svg
            class="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </A>
      </Card.Footer>
    </Card>
  );
};

export default PartCard;
