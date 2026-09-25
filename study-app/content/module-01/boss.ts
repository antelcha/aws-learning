import type { BossRound } from '../../src/engine/types';

const boss: BossRound = {
  id: 'm1-boss',
  module: 'module-01',
  title: 'Launch day outage',
  scenario:
    'A startup launched its app last month on servers in a single Availability Zone. During launch week, a power outage in that AZ took the app offline for hours. The same week, a security review found customer files readable by anyone through a public storage bucket. The founders ask you to walk through what went wrong.',
  steps: [
    {
      id: 'm1-boss-s1',
      type: 'single',
      prompt: 'Step 1: Why did one power outage take the whole app offline?',
      options: [
        { id: 'a', text: 'Every resource was in one AZ, a single point of failure' },
        { id: 'b', text: 'The Region had only one AZ' },
        { id: 'c', text: 'AWS does not protect against power outages at all' },
      ],
      answer: ['a'],
      hint: 'How many AZs does every Region have, and how many did the startup use?',
      explanation: 'Every Region has at least three AZs. Using only one made that AZ a single point of failure.',
      concepts: ['regions-azs', 'high-availability'],
    },
    {
      id: 'm1-boss-s2',
      type: 'single',
      prompt: 'Step 2: Which change keeps the app available the next time one AZ fails, without the cost of a second Region?',
      options: [
        { id: 'a', text: 'Deploy across at least two AZs in the same Region' },
        { id: 'b', text: 'Buy larger instances' },
        { id: 'c', text: 'Deploy to a second Region only' },
      ],
      answer: ['a'],
      hint: 'The failure was local to one isolated location.',
      explanation: 'Multi-AZ protects against data-center-level failures within a Region. Multi-Region adds cost and complexity and targets larger disruptions.',
      concepts: ['regions-azs', 'high-availability'],
    },
    {
      id: 'm1-boss-s3',
      type: 'single',
      prompt: 'Step 3: The founders say the public bucket is AWS\'s fault because storage is a managed service. Who fixes it?',
      options: [
        { id: 'a', text: 'AWS, because it runs the storage infrastructure' },
        { id: 'b', text: 'The startup, because bucket permissions are security in the cloud' },
      ],
      answer: ['b'],
      hint: 'Who controls permissions, whatever the service?',
      explanation: 'AWS runs the infrastructure; the customer controls data, permissions, and bucket configuration.',
      concepts: ['shared-responsibility'],
    },
  ],
};

export default boss;
