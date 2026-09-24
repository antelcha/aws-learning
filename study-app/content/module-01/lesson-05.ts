import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm1-l5-shared-responsibility',
  module: 'module-01',
  order: 5,
  title: 'The AWS Shared Responsibility Model',
  note: '../AWS-Cloud-Practitioner/01-Introduction-to-Cloud/05-AWS-Shared-Responsibility-Model.md',
  keyIdea: [
    'AWS is responsible for security OF the cloud: facilities, hardware, network, virtualization.',
    'The customer is responsible for security IN the cloud: data, identities, configuration, application code.',
    'The split moves with the service: on EC2 you patch the guest OS; on S3 AWS runs everything beneath the service.',
    'A managed service never removes your responsibility for data, access, and secure configuration.',
  ],
  sim: { id: 'shared-responsibility' },
  questions: [
    {
      id: 'm1-l5-q1',
      type: 'single',
      prompt: 'A critical security patch is released for the operating system on your EC2 instances. Who applies it?',
      options: [
        { id: 'a', text: 'AWS, because it owns the hardware' },
        { id: 'b', text: 'The customer, because the guest OS is security in the cloud' },
        { id: 'c', text: 'AWS applies it automatically to every instance' },
      ],
      answer: ['b'],
      hint: 'Is the guest OS part of the infrastructure AWS runs, or something you control on top of it?',
      explanation:
        'On EC2 the customer controls and patches the guest operating system. AWS patches the physical hosts and the virtualization layer.',
      concepts: ['shared-responsibility'],
    },
    {
      id: 'm1-l5-q2',
      type: 'single',
      prompt: 'Customer files leak because an S3 bucket was configured to allow public access. Whose responsibility was that setting?',
      options: [
        { id: 'a', text: 'AWS, because S3 is a managed service' },
        { id: 'b', text: 'The customer' },
        { id: 'c', text: 'Shared equally, so neither is accountable' },
      ],
      answer: ['b'],
      hint: 'Managed service or not, who controls permissions and bucket configuration?',
      explanation:
        'AWS operates the storage infrastructure, but the customer controls data, permissions, and bucket configuration.',
      concepts: ['shared-responsibility'],
    },
    {
      id: 'm1-l5-q3',
      type: 'multi',
      prompt: 'Which are AWS responsibilities under the shared responsibility model? (Choose two.)',
      options: [
        { id: 'a', text: 'Physical security of data centers' },
        { id: 'b', text: 'The virtualization infrastructure' },
        { id: 'c', text: 'Deciding which users can access a bucket' },
        { id: 'd', text: 'Classifying customer data' },
      ],
      answer: ['a', 'b'],
      hint: 'AWS covers security OF the cloud.',
      explanation: 'Facilities and virtualization are security of the cloud (AWS). Access and data classification are security in the cloud (customer).',
      concepts: ['shared-responsibility'],
    },
  ],
};

export default lesson;
