import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l5-pricing',
  module: 'module-02',
  order: 5,
  title: 'Amazon EC2 Pricing',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/00-Module-Overview.md',
  keyIdea: [
    'On-Demand: pay per use with no commitment; suits short-term, unpredictable, or new workloads.',
    'Savings Plans (up to 72% off) and Reserved Instances (up to 75% off) trade a 1- or 3-year commitment for a discount.',
    'Spot Instances (up to 90% off) use spare capacity that AWS can reclaim, so the workload must tolerate interruption.',
    'Dedicated Hosts and Instances provide hardware not shared with other customers, for licensing or compliance needs.',
  ],
  sim: { id: 'pricing' },
  questions: [
    {
      id: 'm2-l5-q1',
      type: 'multi',
      prompt: 'A production app has run steadily 24/7 for two years and will keep doing so. Which options lower its cost the most without risking interruption? (Choose two.)',
      options: [
        { id: 'a', text: 'Savings Plans' },
        { id: 'b', text: 'Reserved Instances' },
        { id: 'c', text: 'Spot Instances' },
        { id: 'd', text: 'On-Demand' },
      ],
      answer: ['a', 'b'],
      hint: 'Predictable, long-term usage is what a commitment rewards.',
      explanation:
        'Steady, predictable usage suits a 1- or 3-year commitment: Savings Plans or Reserved Instances. Spot is cheaper but can be interrupted.',
      concepts: ['pricing', 'savings-plans', 'reserved-instances'],
    },
    {
      id: 'm2-l5-q2',
      type: 'single',
      prompt: 'A nightly image-processing batch can stop and resume later without harm. Which option is cheapest and suitable?',
      options: [
        { id: 'a', text: 'Spot Instances' },
        { id: 'b', text: 'Dedicated Hosts' },
        { id: 'c', text: 'Reserved Instances' },
      ],
      answer: ['a'],
      hint: 'The workload tolerates interruption.',
      explanation: 'Spot offers the deepest discount (up to 90%) for workloads that can handle AWS reclaiming capacity.',
      concepts: ['pricing', 'spot'],
    },
    {
      id: 'm2-l5-q3',
      type: 'single',
      prompt: 'A team is launching a new app and has no idea what its traffic will look like. Which option should it start with?',
      options: [
        { id: 'a', text: 'A 3-year Reserved Instance, for the biggest discount' },
        { id: 'b', text: 'On-Demand, until usage is known' },
        { id: 'c', text: 'Spot, because it is the cheapest' },
      ],
      answer: ['b'],
      hint: 'What happens to a commitment you do not use?',
      explanation:
        'On-Demand has no commitment, which fits unknown usage. Committing too early risks paying for unused hours; once usage is steady, a commitment can follow.',
      concepts: ['pricing'],
    },
  ],
};

export default lesson;
