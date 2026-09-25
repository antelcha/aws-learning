import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l6-scaling',
  module: 'module-02',
  order: 6,
  title: 'Scaling Amazon EC2',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/06-Scaling-Amazon-EC2.md',
  keyIdea: [
    'Scalability is the ability to grow by adding resources; elasticity is adjusting resources out and in automatically as demand changes.',
    'Scale up adds power to an existing instance; scale out adds more instances.',
    'Amazon EC2 Auto Scaling: dynamic scaling reacts to demand in real time; predictive scaling launches instances ahead of anticipated demand.',
    'An Auto Scaling group has a minimum, desired, and maximum capacity; it never goes below the minimum, and you pay only for instances while they run.',
    'Spreading instances across multiple Availability Zones removes a single point of failure: that is high availability.',
  ],
  sim: { id: 'scaling-elb' },
  questions: [
    {
      id: 'm2-l6-q1',
      type: 'multi',
      prompt:
        'A ticket site runs a fixed number of instances in one Availability Zone. Every Friday evening a sale opens and traffic jumps tenfold for a few hours. Which changes address both the slowdown and the single point of failure without paying for peak capacity all week? (Choose two.)',
      options: [
        { id: 'a', text: 'An Auto Scaling group that spreads instances across multiple Availability Zones' },
        { id: 'b', text: 'Buy enough instances for the Friday peak and run them all week' },
        { id: 'c', text: 'Scaling that launches instances ahead of the known Friday peak' },
        { id: 'd', text: 'Move the same instances to a larger size in the same Availability Zone' },
      ],
      answer: ['a', 'c'],
      hint: 'Two problems: an outage in one AZ, and a peak that happens at a known time.',
      explanation:
        'Multi-AZ removes the single point of failure (high availability), and Auto Scaling adds capacity only when needed (elasticity). Because the peak is predictable, predictive scaling can have instances ready before it starts. Running peak capacity all week is over-provisioning; a larger size in one AZ is still one point of failure.',
      concepts: ['auto-scaling', 'high-availability', 'scalability-elasticity'],
    },
    {
      id: 'm2-l6-q2',
      type: 'single',
      prompt:
        'During a busy week, a team first replaces its instance with a larger size. Later it runs four instances of the original size instead. What did it do, in order?',
      options: [
        { id: 'a', text: 'Scaled up, then scaled out' },
        { id: 'b', text: 'Scaled out, then scaled up' },
        { id: 'c', text: 'Scaled in, then scaled up' },
      ],
      answer: ['a'],
      hint: 'One approach makes a machine more powerful; the other adds machines.',
      explanation:
        'A larger instance is scaling up (vertical). More instances is scaling out (horizontal), which is what Auto Scaling does.',
      concepts: ['scalability-elasticity', 'instance-sizing'],
    },
    {
      id: 'm2-l6-q3',
      type: 'single',
      prompt:
        'An app needs at least two instances running at all times, even at night when traffic is near zero. Which Auto Scaling group setting guarantees that?',
      options: [
        { id: 'a', text: 'Minimum capacity of 2' },
        { id: 'b', text: 'Maximum capacity of 2' },
        { id: 'c', text: 'Desired capacity of 2 with a minimum of 0' },
      ],
      answer: ['a'],
      hint: 'Which setting is the floor the group never goes below?',
      explanation:
        'The group never scales in below its minimum capacity, and it launches that many instances when it is created. A maximum of 2 caps growth; a minimum of 0 would let the group scale in to zero.',
      concepts: ['auto-scaling'],
    },
  ],
};

export default lesson;
