/** The allowed concept tags. `npm run check` rejects any other tag. */
export const concepts = [
  'client-server',
  'cloud-benefits',
  'provisioning',
  'high-availability',
  'fault-tolerance',
  'regions-azs',
  'shared-responsibility',
  'ec2-basics',
  'multi-tenancy',
  'instance-families',
  'instance-sizing',
  'aws-apis',
  'automation',
  'managed-vs-unmanaged',
  'ami',
  'pricing',
  'savings-plans',
  'reserved-instances',
  'spot',
  'dedicated',
] as const;

export type Concept = (typeof concepts)[number];
