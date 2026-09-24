import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm1-l2-what-is-cloud',
  module: 'module-01',
  order: 2,
  title: 'What Is Cloud Computing?',
  note: '../AWS-Cloud-Practitioner/01-Introduction-to-Cloud/02-What-Is-Cloud-Computing.md',
  keyIdea: [
    'Amazon began as an online bookstore and later offered its infrastructure as AWS services.',
    'Amazon S3 (Simple Storage Service) was one of the earliest AWS services.',
    "The course's own definition of cloud computing is still pending in the notes.",
  ],
  questions: [
    {
      id: 'm1-l2-q1',
      type: 'single',
      prompt: 'Which statement best matches how AWS describes cloud computing?',
      options: [
        { id: 'a', text: 'Buying servers upfront and hosting them in your own data center' },
        { id: 'b', text: 'On-demand delivery of IT resources over the internet with pay-as-you-go pricing' },
        { id: 'c', text: 'Renting a fixed number of physical servers on a multi-year contract' },
        { id: 'd', text: 'Running software only on employees\' laptops' },
      ],
      answer: ['b'],
      hint: 'Think about when you get resources and how you pay for them.',
      explanation:
        'AWS describes cloud computing as on-demand delivery of IT resources over the internet with pay-as-you-go pricing. The course wording is not yet captured in the notes, so this uses AWS\'s public definition.',
      concepts: ['cloud-benefits'],
      beyondCourse: true,
    },
    {
      id: 'm1-l2-q2',
      type: 'single',
      prompt: 'Amazon S3 was one of the earliest AWS services. What kind of service is it?',
      options: [
        { id: 'a', text: 'Virtual servers' },
        { id: 'b', text: 'Object storage' },
        { id: 'c', text: 'A relational database' },
        { id: 'd', text: 'A content delivery network' },
      ],
      answer: ['b'],
      hint: 'Expand the name: Simple ___ Service.',
      explanation: 'S3 stands for Simple Storage Service; it stores objects (files and their metadata). EC2 provides virtual servers.',
      concepts: ['cloud-benefits'],
      beyondCourse: true,
    },
  ],
};

export default lesson;
