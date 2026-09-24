import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm1-l4-global-infra',
  module: 'module-01',
  order: 4,
  title: 'Introduction to AWS Global Infrastructure',
  note: '../AWS-Cloud-Practitioner/01-Introduction-to-Cloud/04-AWS-Global-Infrastructure.md',
  keyIdea: [
    'A Region is a separate geographic area; an Availability Zone (AZ) is an isolated location within a Region.',
    'Every Region has at least three AZs.',
    'High availability minimizes downtime; fault tolerance keeps running through the failures it was designed for.',
    'Multi-AZ protects against a data-center-level failure; multi-Region protects against larger disruptions at more cost.',
    'Regions are also chosen for latency, regulations, and data residency.',
  ],
  sim: { id: 'global-infra' },
  questions: [
    {
      id: 'm1-l4-q1',
      type: 'single',
      prompt:
        'An app runs on instances in a single AZ. A power outage takes that AZ down and the app goes offline. What is the most direct fix?',
      options: [
        { id: 'a', text: 'Use larger instances in the same AZ' },
        { id: 'b', text: 'Run instances in multiple AZs within the Region' },
        { id: 'c', text: 'Move everything to a single AZ in another Region' },
        { id: 'd', text: 'Nothing: AWS guarantees every AZ stays up' },
      ],
      answer: ['b'],
      hint: 'The failure was limited to one isolated location inside the Region.',
      explanation:
        'Spreading across AZs means one AZ outage leaves the others running. A single AZ in another Region has the same single point of failure.',
      concepts: ['regions-azs', 'high-availability'],
    },
    {
      id: 'm1-l4-q2',
      type: 'single',
      prompt:
        'Which term describes a system that keeps operating with little or no interruption when a failure it was designed to tolerate occurs?',
      options: [
        { id: 'a', text: 'High availability' },
        { id: 'b', text: 'Fault tolerance' },
        { id: 'c', text: 'Elasticity' },
      ],
      answer: ['b'],
      hint: 'One term allows a brief interruption; the other aims for none.',
      explanation:
        'Fault tolerance keeps the system running through designed-for failures. High availability minimizes downtime but can allow a brief interruption.',
      concepts: ['fault-tolerance', 'high-availability'],
    },
    {
      id: 'm1-l4-q3',
      type: 'multi',
      prompt: 'Which are valid reasons for choosing a particular AWS Region? (Choose two.)',
      options: [
        { id: 'a', text: 'Lower latency for the users of the application' },
        { id: 'b', text: 'Data residency or regulatory requirements' },
        { id: 'c', text: 'Some Regions have only one AZ, which is simpler' },
        { id: 'd', text: 'Choosing a Region removes the need for multiple AZs' },
      ],
      answer: ['a', 'b'],
      hint: 'Every Region has at least three AZs.',
      explanation:
        'Latency and regulations or data residency drive Region choice. Every Region has at least three AZs, and a Region choice does not replace a multi-AZ design.',
      concepts: ['regions-azs'],
    },
  ],
};

export default lesson;
