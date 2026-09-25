import type { BossRound } from '../../src/engine/types';

const boss: BossRound = {
  id: 'm2-boss',
  module: 'module-02',
  title: 'Monday slowdown and a bigger bill',
  scenario:
    'Every Monday, traffic spikes and the site is slow. The team responds by launching extra general purpose instances from the console, and each new server installs its packages at startup for 12 minutes. All servers sit in one Availability Zone, and the front end has the back-end IP addresses hardcoded. When the order-confirmation service falls behind, checkout calls to it fail and orders are dropped. This quarter the bill is up 40%: some Monday instances were never terminated, and the always-on base servers are billed On-Demand. Work through the incident step by step.',
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
    {
      id: 'm2-boss-s5',
      type: 'single',
      prompt:
        'Step 5: The team wants Monday capacity to follow demand on its own, never drop below the two base servers, and survive an Availability Zone outage. What fits?',
      options: [
        { id: 'a', text: 'An Auto Scaling group with a minimum of 2, spread across multiple Availability Zones' },
        { id: 'b', text: 'Run the Monday peak number of instances all week in the current AZ' },
        { id: 'c', text: 'One much larger instance in the current AZ' },
      ],
      answer: ['a'],
      hint: 'Three needs: follow demand, keep a floor, and remove the single point of failure.',
      explanation:
        'Auto Scaling adds and removes instances with demand (elasticity) and never goes below the minimum. Spreading across AZs gives high availability. Peak capacity all week is over-provisioning; one large instance is scaling up in a single AZ.',
      concepts: ['auto-scaling', 'high-availability', 'scalability-elasticity'],
    },
    {
      id: 'm2-boss-s6',
      type: 'single',
      prompt:
        'Step 6: The Auto Scaling group now adds back-end instances on Monday, but they sit idle while the original ones are overloaded. What is missing?',
      options: [
        { id: 'a', text: 'A higher maximum capacity' },
        { id: 'b', text: 'Elastic Load Balancing in front of the back end, replacing the hardcoded addresses' },
        { id: 'c', text: 'Predictive scaling' },
      ],
      answer: ['b'],
      hint: 'The instances exist. What decides where requests go?',
      explanation:
        'The front end only knows the hardcoded addresses. ELB gives it one endpoint, new instances register with the load balancer, and requests are spread across all available instances.',
      concepts: ['load-balancing', 'auto-scaling'],
    },
    {
      id: 'm2-boss-s7',
      type: 'single',
      prompt:
        'Step 7: Checkout calls the order-confirmation service directly, so orders are dropped whenever it falls behind or restarts. What stops the loss?',
      options: [
        { id: 'a', text: 'An Amazon SQS queue between checkout and the confirmation service' },
        { id: 'b', text: 'An Amazon SNS topic that the confirmation service subscribes to' },
        { id: 'c', text: 'Retrying the direct call until it succeeds' },
      ],
      answer: ['a'],
      hint: 'Which option keeps each order until the consumer is ready for it?',
      explanation:
        'With SQS, checkout writes each order to the queue and moves on; the confirmation service processes messages when it can, so nothing is lost while it catches up. SNS pushes messages right away and does not hold them; retrying a direct call keeps the two services tightly coupled.',
      concepts: ['sqs', 'loose-coupling'],
    },
  ],
};

export default boss;
