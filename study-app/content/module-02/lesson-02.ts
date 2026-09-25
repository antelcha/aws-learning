import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l2-instance-types',
  module: 'module-02',
  order: 2,
  title: 'Amazon EC2 Instance Types',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/02-Amazon-EC2-Instance-Types.md',
  keyIdea: [
    'Instance families: general purpose, compute optimized, memory optimized, accelerated computing, storage optimized.',
    'Match the family to the bottleneck: CPU, data in memory, hardware acceleration, or locally stored data.',
    'General purpose is a good start when performance needs are unknown.',
    'Then pick a size: bigger sizes cost more. Type and size can be changed later.',
  ],
  sim: { id: 'instance-matcher' },
  questions: [
    {
      id: 'm2-l2-q1',
      type: 'single',
      prompt:
        'A web app on a general purpose instance runs at 95% CPU and 30% memory. Which family matches it better?',
      options: [
        { id: 'a', text: 'Memory optimized' },
        { id: 'b', text: 'Compute optimized' },
        { id: 'c', text: 'Storage optimized' },
        { id: 'd', text: 'Accelerated computing' },
      ],
      answer: ['b'],
      hint: 'Which resource is the bottleneck? Use the exam term for the family.',
      explanation: 'CPU is the bottleneck, so compute optimized fits. On the exam it is called "compute optimized", not "CPU optimized".',
      concepts: ['instance-families'],
    },
    {
      id: 'm2-l2-q2',
      type: 'single',
      prompt:
        'Why is moving the same app to a bigger general purpose size less cost-efficient than switching families?',
      options: [
        { id: 'a', text: 'Bigger sizes add storage you do not need' },
        { id: 'b', text: 'General purpose sizes scale CPU and memory together, so you pay for more idle memory' },
        { id: 'c', text: 'Bigger sizes cannot be changed later' },
      ],
      answer: ['b'],
      hint: 'Memory is already at 30%. What else grows with the size?',
      explanation:
        'A bigger general purpose size adds CPU and memory together, so the extra memory is paid for but idle. It works as a quick fix, just less efficiently.',
      concepts: ['instance-sizing', 'instance-families'],
    },
    {
      id: 'm2-l2-q3',
      type: 'single',
      prompt:
        'A job analyzes historical data stored on the instance and needs consistent, high disk throughput. Which family?',
      options: [
        { id: 'a', text: 'Memory optimized' },
        { id: 'b', text: 'Storage optimized' },
        { id: 'c', text: 'General purpose' },
      ],
      answer: ['b'],
      hint: 'Is the data processed in memory, or read from local storage?',
      explanation:
        'High-throughput access to locally stored data points to storage optimized. Processing large datasets in memory would point to memory optimized.',
      concepts: ['instance-families'],
    },
  ],
};

export default lesson;
