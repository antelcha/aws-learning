export interface Placement {
  region: string;
  az: string;
}

export type Outage = { kind: 'none' } | { kind: 'az'; az: string } | { kind: 'region'; region: string };

/** A small, illustrative subset of Regions; every real Region has at least three AZs. */
export const REGIONS: { id: string; name: string; azs: string[] }[] = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', azs: ['us-east-1a', 'us-east-1b', 'us-east-1c'] },
  { id: 'eu-west-1', name: 'Europe (Ireland)', azs: ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'] },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', azs: ['ap-southeast-1a', 'ap-southeast-1b', 'ap-southeast-1c'] },
];

export function isAffected(p: Placement, outage: Outage): boolean {
  switch (outage.kind) {
    case 'none':
      return false;
    case 'az':
      return p.az === outage.az;
    case 'region':
      return p.region === outage.region;
  }
}

export function survivingPlacements(deployment: Placement[], outage: Outage): Placement[] {
  return deployment.filter((p) => !isAffected(p, outage));
}

/** The app stays available while at least one placement is unaffected. */
export function survives(deployment: Placement[], outage: Outage): boolean {
  return survivingPlacements(deployment, outage).length > 0;
}
