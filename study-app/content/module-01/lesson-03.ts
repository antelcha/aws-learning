import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm1-l3-benefits',
  module: 'module-01',
  order: 3,
  title: 'Benefits of AWS Cloud',
  note: '../AWS-Cloud-Practitioner/01-Introduction-to-Cloud/03-Benefits-of-AWS-Cloud.md',
  keyIdea: [
    'Six benefits: pay as you go, economies of scale, stop guessing capacity, speed and agility, stop running data centers, go global in minutes.',
    'Compare against the real costs of owning infrastructure: hardware, staff, capacity, storage, maintenance.',
    'Provisioning creates and prepares a resource; deprovisioning removes it and releases its capacity.',
    'Deprovisioning can delete data; it is not always just stopping a resource.',
  ],
  questions: [
    {
      id: 'm1-l3-q1',
      type: 'single',
      prompt:
        'A retailer buys enough servers to survive its busiest shopping weekend. For the other 50 weeks, most of them sit idle. Which benefit addresses this?',
      options: [
        { id: 'a', text: 'Go global in minutes' },
        { id: 'b', text: 'Stop guessing capacity' },
        { id: 'c', text: 'Benefit from massive economies of scale' },
        { id: 'd', text: 'Stop spending money running and maintaining data centers' },
      ],
      answer: ['b'],
      hint: 'The problem is sizing for a peak in advance.',
      explanation:
        'Stop guessing capacity: add resources for the peak and remove them afterward instead of buying for the maximum upfront.',
      concepts: ['cloud-benefits'],
    },
    {
      id: 'm1-l3-q2',
      type: 'single',
      prompt:
        'A European startup wants low latency for new customers in Asia without building a facility there. Which benefit fits?',
      options: [
        { id: 'a', text: 'Go global in minutes' },
        { id: 'b', text: 'Pay as you go' },
        { id: 'c', text: 'Increase speed and agility' },
      ],
      answer: ['a'],
      hint: 'The key words are "customers in another part of the world".',
      explanation: 'Go global in minutes: deploy closer to users through AWS global infrastructure instead of building physical facilities.',
      concepts: ['cloud-benefits', 'regions-azs'],
    },
    {
      id: 'm1-l3-q3',
      type: 'single',
      prompt: 'A developer terminates a test EC2 instance they no longer need. What is this, and what should they check first?',
      options: [
        { id: 'a', text: 'Provisioning; check the instance size' },
        { id: 'b', text: 'Deprovisioning; check that no data on it is still needed' },
        { id: 'c', text: 'Deprovisioning; nothing, because terminating only pauses the instance' },
        { id: 'd', text: 'Scaling; check the traffic curve' },
      ],
      answer: ['b'],
      hint: 'Terminating is not the same as stopping.',
      explanation:
        'Terminating releases the resource, which is deprovisioning. Depending on the service, deprovisioning can delete data, so confirm nothing is still needed.',
      concepts: ['provisioning'],
    },
  ],
};

export default lesson;
