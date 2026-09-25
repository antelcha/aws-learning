import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l1-intro-ec2',
  module: 'module-02',
  order: 1,
  title: 'Introduction to Amazon EC2',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/01-Introduction-to-Amazon-EC2.md',
  keyIdea: [
    'Amazon EC2 provides virtual servers, called instances, on AWS hardware.',
    'Instances launch in minutes and can be resized or terminated as demand changes; physical servers take weeks to buy and set up.',
    'Multi-tenancy: instances from different customers can share a physical host, isolated by a hypervisor that AWS runs.',
    'The customer still owns the guest OS, patching, applications, security groups, and data.',
  ],
  questions: [
    {
      id: 'm2-l1-q1',
      type: 'single',
      prompt:
        'A team waits six weeks for new on-premises servers and must size them for traffic it cannot predict. What does EC2 change?',
      options: [
        { id: 'a', text: 'Hardware arrives faster, but capacity must still be fixed upfront' },
        { id: 'b', text: 'Instances launch in minutes and can be resized or terminated as demand changes' },
        { id: 'c', text: 'AWS manages the application and its data for the team' },
      ],
      answer: ['b'],
      hint: 'Compare how long it takes and what happens when the guess is wrong.',
      explanation:
        'EC2 instances launch in minutes and can be added, resized, or terminated, so capacity follows demand instead of a guess.',
      concepts: ['ec2-basics', 'provisioning'],
    },
    {
      id: 'm2-l1-q2',
      type: 'single',
      prompt: 'Your EC2 instance may run on the same physical host as another customer\'s instance. What keeps them separated?',
      options: [
        { id: 'a', text: 'Your security group rules' },
        { id: 'b', text: 'A hypervisor that AWS runs and is responsible for' },
        { id: 'c', text: 'Nothing: shared hosts are visible to every tenant' },
      ],
      answer: ['b'],
      hint: 'Which layer of the stack sits between the hardware and each instance?',
      explanation:
        'Multi-tenancy is isolated by the hypervisor, which is part of security of the cloud (AWS). Security groups control network traffic, not host isolation.',
      concepts: ['multi-tenancy', 'shared-responsibility'],
    },
    {
      id: 'm2-l1-q3',
      type: 'single',
      prompt: 'A compliance rule says your workload must run on hardware not shared with other AWS customers. What fits?',
      options: [
        { id: 'a', text: 'Spot Instances' },
        { id: 'b', text: 'Dedicated Instances or Dedicated Hosts' },
        { id: 'c', text: 'A larger instance size' },
      ],
      answer: ['b'],
      hint: 'Default EC2 is multi-tenant; which option removes other tenants?',
      explanation: 'Dedicated Instances and Dedicated Hosts run on hardware dedicated to one customer, at a higher cost.',
      concepts: ['multi-tenancy', 'dedicated'],
    },
  ],
};

export default lesson;
