import { describe, expect, it } from 'vitest';
import { survives, survivingPlacements, type Placement } from './model';

const oneAz: Placement[] = [{ region: 'us-east-1', az: 'us-east-1a' }];
const multiAz: Placement[] = [
  { region: 'us-east-1', az: 'us-east-1a' },
  { region: 'us-east-1', az: 'us-east-1b' },
];
const multiRegion: Placement[] = [
  { region: 'us-east-1', az: 'us-east-1a' },
  { region: 'eu-west-1', az: 'eu-west-1a' },
];

describe('survives', () => {
  it('a single-AZ deployment fails when its AZ fails', () => {
    expect(survives(oneAz, { kind: 'az', az: 'us-east-1a' })).toBe(false);
    expect(survives(oneAz, { kind: 'az', az: 'us-east-1b' })).toBe(true);
  });
  it('a multi-AZ deployment survives one AZ outage but not a Region outage', () => {
    expect(survives(multiAz, { kind: 'az', az: 'us-east-1a' })).toBe(true);
    expect(survives(multiAz, { kind: 'region', region: 'us-east-1' })).toBe(false);
  });
  it('a multi-Region deployment survives a Region outage', () => {
    expect(survives(multiRegion, { kind: 'region', region: 'us-east-1' })).toBe(true);
    expect(survivingPlacements(multiRegion, { kind: 'region', region: 'us-east-1' })).toEqual([multiRegion[1]]);
  });
  it('an empty deployment never survives', () => {
    expect(survives([], { kind: 'none' })).toBe(false);
  });
});
