import type { BossRound } from '../../src/engine/types';

const boss: BossRound = {
  id: 'm2-boss',
  module: 'module-02',
  title: 'Monday slowdown and a bigger bill',
  scenario:
    'Every Monday, traffic spikes and the site is slow. The team responds by launching extra general purpose instances from the console, and each new server installs its packages at startup for 12 minutes. This quarter the bill is up 40%: some Monday instances were never terminated, and the always-on base servers are billed On-Demand. Work through the incident step by step.',
  steps: [
    {
      id: 'm2-boss-s1',
      type: 'single',
      prompt: 'Step 1: Monitoring shows CPU at 95% and memory at 30% on the web servers. Which family should they run on?',
      options: [
        { id: 'a', text: 'Compute optimized' },
        { id: 'b', text: 'Memory optimized' },
        { id: 'c', text: 'A bigger general purpose size' },
      ],
      answer: ['a'],
      hint: 'Find the bottleneck, and avoid paying for idle memory.',
      explanation: 'CPU is the bottleneck. Compute optimized adds CPU without paying for memory that sits idle.',
      concepts: ['instance-families', 'instance-sizing'],
    },
    {
      id: 'm2-boss-s2',
      type: 'single',
      prompt: 'Step 2: New servers take 12 minutes to become useful. What shortens that?',
      options: [
        { id: 'a', text: 'A custom AMI with the packages preinstalled' },
        { id: 'b', text: 'Launching them earlier from the console' },
        { id: 'c', text: 'A Marketplace AMI for the operating system' },
      ],
      answer: ['a'],
      hint: 'Move the installation from launch time to image build time.',
      explanation: 'A custom AMI bakes the packages in once, so each launch is ready sooner and identical.',
      concepts: ['ami'],
    },
    {
      id: 'm2-boss-s3',
      type: 'single',
      prompt: 'Step 3: Forgotten Monday instances keep running. What addresses the root cause?',
      options: [
        { id: 'a', text: 'Remind the team in chat every Friday' },
        { id: 'b', text: 'Script the launch and the teardown with the CLI or an SDK' },
        { id: 'c', text: 'Switch the forgotten instances to Spot' },
      ],
      answer: ['b'],
      hint: 'Manual console steps are the root cause of both mistakes and forgotten resources.',
      explanation: 'Automating provisioning and deprovisioning makes both repeatable, so nothing is left running by accident.',
      concepts: ['automation', 'provisioning'],
    },
    {
      id: 'm2-boss-s4',
      type: 'single',
      prompt: 'Step 4: Two base servers run 24/7 all year on On-Demand. What cuts that cost?',
      options: [
        { id: 'a', text: 'A Savings Plan or Reserved Instances for the two base servers' },
        { id: 'b', text: 'Spot Instances for the base servers' },
        { id: 'c', text: 'Dedicated Hosts' },
      ],
      answer: ['a'],
      hint: 'The base load is steady and predictable; the site must not be interrupted.',
      explanation: 'Steady, predictable usage suits a 1- or 3-year commitment. Spot could interrupt the site; Dedicated Hosts cost more.',
      concepts: ['pricing', 'savings-plans', 'reserved-instances'],
    },
  ],
};

export default boss;
