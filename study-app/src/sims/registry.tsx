import type { ComponentType } from 'react';
import type { SimId } from '../engine/types';
import { GlobalInfraSim } from './global-infra/GlobalInfraSim';
import { InstanceMatcherSim } from './instance-matcher/InstanceMatcherSim';
import { PricingSim } from './pricing/PricingSim';
import { SharedResponsibilitySim } from './shared-responsibility/SharedResponsibilitySim';

export interface SimProps {
  config?: Record<string, unknown>;
}

export const sims: Record<SimId, ComponentType<SimProps>> = {
  pricing: PricingSim,
  'global-infra': GlobalInfraSim,
  'shared-responsibility': SharedResponsibilitySim,
  'instance-matcher': InstanceMatcherSim,
};
