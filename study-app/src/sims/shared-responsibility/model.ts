export type Owner = 'aws' | 'customer';
export type Service = 'ec2' | 's3';

export interface ResponsibilityItem {
  id: string;
  text: string;
  owner: Record<Service, Owner>;
  why: Record<Service, string>;
}

export const RESPONSIBILITY_ITEMS: ResponsibilityItem[] = [
  {
    id: 'physical',
    text: 'Physical security of the data centers',
    owner: { ec2: 'aws', s3: 'aws' },
    why: {
      ec2: 'Security of the cloud: AWS runs the facilities.',
      s3: 'Security of the cloud: AWS runs the facilities.',
    },
  },
  {
    id: 'hardware',
    text: 'Servers, storage hardware, and the network that connects them',
    owner: { ec2: 'aws', s3: 'aws' },
    why: {
      ec2: 'AWS owns and maintains the physical infrastructure.',
      s3: 'AWS owns and maintains the physical infrastructure.',
    },
  },
  {
    id: 'virtualization',
    text: 'The virtualization or service software that isolates customers',
    owner: { ec2: 'aws', s3: 'aws' },
    why: {
      ec2: 'AWS runs the hypervisor that isolates instances from different customers.',
      s3: 'AWS runs the storage service software.',
    },
  },
  {
    id: 'os-patching',
    text: 'Patching the operating system that runs the workload',
    owner: { ec2: 'customer', s3: 'aws' },
    why: {
      ec2: 'EC2 is unmanaged: the guest operating system is yours to patch.',
      s3: 'S3 exposes no operating system to you; AWS maintains everything beneath the service.',
    },
  },
  {
    id: 'data',
    text: 'Classifying and protecting the data you store',
    owner: { ec2: 'customer', s3: 'customer' },
    why: {
      ec2: 'Your data is always your responsibility.',
      s3: 'A managed service does not take over responsibility for your data.',
    },
  },
  {
    id: 'access',
    text: 'Deciding who can access the resource (identities and permissions)',
    owner: { ec2: 'customer', s3: 'customer' },
    why: {
      ec2: 'You manage identities, permissions, and key pairs.',
      s3: 'You manage bucket policies and permissions.',
    },
  },
  {
    id: 'network-config',
    text: 'Network access settings, such as firewall rules or public access',
    owner: { ec2: 'customer', s3: 'customer' },
    why: {
      ec2: 'You configure security groups (the instance firewall).',
      s3: 'You configure bucket access settings, including public access.',
    },
  },
];

export interface Score {
  correct: number;
  total: number;
  wrong: string[];
  unanswered: string[];
}

export function scoreAssignments(
  items: ResponsibilityItem[],
  service: Service,
  assignments: Partial<Record<string, Owner>>,
): Score {
  const score: Score = { correct: 0, total: items.length, wrong: [], unanswered: [] };
  for (const item of items) {
    const picked = assignments[item.id];
    if (picked === undefined) score.unanswered.push(item.id);
    else if (picked === item.owner[service]) score.correct++;
    else score.wrong.push(item.id);
  }
  return score;
}
