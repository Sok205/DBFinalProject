import { Component } from 'solid-js';
import { Badge } from './ui';

interface LifecycleGaugeProps {
  percentage?: number;
  mileage?: number;
  limit?: number;
  compact?: boolean;
}

type StatusType = 'good' | 'warning' | 'critical' | 'unknown';

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  good: {
    label: 'Good',
    color: 'bg-status-good',
    bgColor: 'bg-status-good/20',
    variant: 'success',
  },
  warning: {
    label: 'Warning',
    color: 'bg-status-warning',
    bgColor: 'bg-status-warning/20',
    variant: 'warning',
  },
  critical: {
    label: 'Critical',
    color: 'bg-status-critical',
    bgColor: 'bg-status-critical/20',
    variant: 'danger',
  },
  unknown: {
    label: 'No Data',
    color: 'bg-f1-silver',
    bgColor: 'bg-f1-silver/20',
    variant: 'default',
  },
};

const LifecycleGauge: Component<LifecycleGaugeProps> = (props) => {
  const getStatus = (): StatusType => {
    if (!props.percentage) return 'unknown';
    if (props.percentage >= 90) return 'critical';
    if (props.percentage >= 70) return 'warning';
    return 'good';
  };

  const config = () => statusConfig[getStatus()];

  return (
    <div class={`${props.compact ? 'p-2' : 'p-4'} bg-f1-black/50 rounded-lg border border-f1-carbon-light`}>
      {/* Header */}
      <div class="flex justify-between items-center mb-3">
        <span class={`${props.compact ? 'text-xs' : 'text-sm'} font-semibold text-f1-silver uppercase tracking-wider`}>
          Lifecycle Status
        </span>
        <Badge variant={config().variant} size={props.compact ? 'sm' : 'md'}>
          {config().label}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div class="relative">
        {/* Background track */}
        <div class={`${props.compact ? 'h-3' : 'h-5'} bg-f1-carbon rounded-full overflow-hidden`}>
          {/* Progress fill */}
          <div
            class={`h-full ${config().color} transition-all duration-500 ease-out relative overflow-hidden`}
            style={{ width: `${props.percentage || 0}%` }}
          >
            {/* Animated shine effect */}
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12" />
          </div>
        </div>

        {/* Threshold markers */}
        {!props.compact && (
          <>
            <div
              class="absolute top-0 h-5 w-0.5 bg-status-warning/50"
              style={{ left: '70%' }}
            />
            <div
              class="absolute top-0 h-5 w-0.5 bg-status-critical/50"
              style={{ left: '90%' }}
            />
          </>
        )}
      </div>

      {/* Details */}
      <div class={`${props.compact ? 'mt-2' : 'mt-3'} flex justify-between items-center`}>
        <span class={`${props.compact ? 'text-xs' : 'text-sm'} text-f1-silver font-mono`}>
          {props.mileage != null && props.limit != null ? (
            <>
              <span class="text-white font-semibold">{props.mileage.toLocaleString()}</span>
              <span class="text-f1-silver/70"> / {props.limit.toLocaleString()} km</span>
            </>
          ) : (
            <span>{props.percentage ? `${props.percentage.toFixed(1)}%` : 'N/A'}</span>
          )}
        </span>
        {props.percentage !== undefined && (
          <span class={`${props.compact ? 'text-xs' : 'text-sm'} font-bold ${
            getStatus() === 'critical' ? 'text-status-critical' :
            getStatus() === 'warning' ? 'text-status-warning' :
            'text-status-good'
          }`}>
            {props.percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default LifecycleGauge;
