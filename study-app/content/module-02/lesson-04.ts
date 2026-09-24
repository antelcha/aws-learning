import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l4-ami',
  module: 'module-02',
  order: 4,
  title: 'Demo: Launching an Amazon EC2 Instance',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/04-Demo-Launching-an-Amazon-EC2-Instance.md',
  keyIdea: [
    'An AMI (Amazon Machine Image) holds what an instance needs to start: OS, storage setup, architecture, launch permissions, and installed software.',
    'One AMI launches many identical instances, which keeps environments consistent.',
    'Three sources: a custom AMI, an AWS-provided AMI, or AWS Marketplace.',
  ],
  questions: [
    {
      id: 'm2-l4-q1',
      type: 'single',
      prompt:
        'Web servers launch from an AWS-provided Amazon Linux AMI, then install 15 packages at startup, which takes 12 minutes. Package versions sometimes differ between servers. What fixes both problems?',
      options: [
        { id: 'a', text: 'A larger instance type so installation runs faster' },
        { id: 'b', text: 'A custom AMI with the packages preinstalled' },
        { id: 'c', text: 'A different AWS-provided AMI' },
      ],
      answer: ['b'],
      hint: 'When would the packages be installed if they were part of the image?',
      explanation:
        'Packages are installed once when the custom AMI is built. Every launch reuses that image, so startup is faster and versions are identical.',
      concepts: ['ami'],
    },
    {
      id: 'm2-l4-q2',
      type: 'single',
      prompt: 'You need an instance that runs a commercial firewall appliance from a third-party vendor. Where do you get the AMI?',
      options: [
        { id: 'a', text: 'AWS Marketplace' },
        { id: 'b', text: 'Build a custom AMI from scratch' },
        { id: 'c', text: 'The AWS-provided AMI list' },
      ],
      answer: ['a'],
      hint: 'Which source sells specialized software from other vendors?',
      explanation: 'AWS Marketplace offers AMIs from third-party vendors with specialized software.',
      concepts: ['ami'],
    },
    {
      id: 'm2-l4-q3',
      type: 'multi',
      prompt: 'Which does an AMI include? (Choose three.)',
      options: [
        { id: 'a', text: 'The operating system' },
        { id: 'b', text: 'Launch permissions' },
        { id: 'c', text: 'Preinstalled software' },
        { id: 'd', text: 'The monthly bill for the instance' },
      ],
      answer: ['a', 'b', 'c'],
      hint: 'An AMI is more than an operating system snapshot, but it is not billing data.',
      explanation: 'An AMI includes the OS, storage setup, architecture type, launch permissions, and extra software.',
      concepts: ['ami'],
    },
  ],
};

export default lesson;
