import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l7-elb',
  module: 'module-02',
  order: 7,
  title: 'Directing Traffic with Elastic Load Balancing',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/07-Directing-Traffic-with-Elastic-Load-Balancing.md',
  keyIdea: [
    'Auto Scaling adds instances, but traffic does not spread itself; a load balancer routes each request to an available instance.',
    'Elastic Load Balancing (ELB) is managed and Regional, scales with traffic on its own, and handles internet and internal traffic.',
    'ELB decouples tiers: the front end calls one endpoint, and new back-end instances register with it and start receiving traffic.',
    'Auto Scaling changes how many instances exist; ELB distributes requests across the ones that are available.',
  ],
  sim: { id: 'scaling-elb', config: { loadBalancer: false } },
  questions: [
    {
      id: 'm2-l7-q1',
      type: 'single',
      prompt:
        'Front-end servers have a hardcoded list of back-end IP addresses. During a spike, the back-end Auto Scaling group adds four instances, but they stay idle while the original ones are overloaded. What fixes this?',
      options: [
        { id: 'a', text: 'Put Elastic Load Balancing in front of the back end, so the front end calls one endpoint' },
        { id: 'b', text: 'Raise the Auto Scaling group\'s maximum capacity' },
        { id: 'c', text: 'Scale up the original back-end instances' },
      ],
      answer: ['a'],
      hint: 'The new instances exist. Why does no traffic reach them?',
      explanation:
        'The front end only knows the hardcoded addresses. With ELB, new instances register with the load balancer and receive traffic, and the front end no longer needs to know each back-end instance. More or larger instances do not help if traffic cannot reach them.',
      concepts: ['load-balancing', 'auto-scaling'],
    },
    {
      id: 'm2-l7-q2',
      type: 'multi',
      prompt: 'Which statements about Elastic Load Balancing and Amazon EC2 Auto Scaling are correct? (Choose two.)',
      options: [
        { id: 'a', text: 'ELB distributes incoming traffic across the available instances' },
        { id: 'b', text: 'Auto Scaling adds and removes instances to match demand' },
        { id: 'c', text: 'ELB launches new instances when traffic grows' },
        { id: 'd', text: 'Auto Scaling makes existing instances larger' },
      ],
      answer: ['a', 'b'],
      hint: 'One service changes the number of instances; the other decides where each request goes.',
      explanation:
        'They are separate services that work together: Auto Scaling adds and removes instances, and ELB spreads requests across whatever instances are currently available. ELB creates no instances, and Auto Scaling scales out, not up.',
      concepts: ['load-balancing', 'auto-scaling'],
    },
    {
      id: 'm2-l7-q3',
      type: 'single',
      prompt:
        'A team runs an off-the-shelf load balancer on its own EC2 instances and spends hours patching, upgrading, and handling failover for it. What does moving to ELB change?',
      options: [
        { id: 'a', text: 'AWS runs, patches, and scales the load balancer; the team only configures it' },
        { id: 'b', text: 'Nothing: the customer still patches ELB like any EC2 instance' },
        { id: 'c', text: 'The back end no longer needs more than one instance' },
      ],
      answer: ['a'],
      hint: 'Is ELB a managed or an unmanaged service?',
      explanation:
        'A self-managed load balancer leaves maintenance, patching, and failover to the customer. ELB is managed: AWS handles that work and it scales with traffic.',
      concepts: ['load-balancing', 'managed-vs-unmanaged'],
    },
  ],
};

export default lesson;
