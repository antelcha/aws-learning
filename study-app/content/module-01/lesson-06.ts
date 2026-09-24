import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm1-l6-real-life',
  module: 'module-01',
  order: 6,
  title: 'Applying Cloud Concepts to Real-Life Use Cases',
  note: '../AWS-Cloud-Practitioner/01-Introduction-to-Cloud/06-Applying-Cloud-Concepts-to-Real-Life-Use-Cases.md',
  keyIdea: [
    "The video's specific use cases are not captured in the notes yet.",
    'These scenarios apply Module 1 concepts: benefits, provisioning, global infrastructure, shared responsibility.',
    'For each scenario, name the problem first, then the concept that solves it.',
  ],
  questions: [
    {
      id: 'm1-l6-q1',
      type: 'single',
      prompt:
        'A marketing team needs a campaign website for two weeks only. Which approach uses the cloud best?',
      options: [
        { id: 'a', text: 'Buy a server so it can be reused for the next campaign' },
        { id: 'b', text: 'Provision resources for the campaign and deprovision them when it ends' },
        { id: 'c', text: 'Sign a three-year hosting contract for a lower rate' },
      ],
      answer: ['b'],
      hint: 'Pay as you go works best when you stop paying at the end.',
      explanation:
        'Provision what the campaign needs and deprovision it afterward, paying only for the two weeks (pay as you go, speed and agility).',
      concepts: ['provisioning', 'cloud-benefits'],
    },
    {
      id: 'm1-l6-q2',
      type: 'single',
      prompt:
        'A company moves its database to a managed AWS service and concludes it no longer has any security responsibilities. What is wrong with that?',
      options: [
        { id: 'a', text: 'Nothing: managed services transfer all responsibility to AWS' },
        { id: 'b', text: 'It still owns its data, who can access it, and its configuration choices' },
        { id: 'c', text: 'It must now secure the AWS data center as well' },
      ],
      answer: ['b'],
      hint: 'What never moves to AWS, whichever service you pick?',
      explanation:
        'A more managed service shifts more of the stack to AWS, but data, access, and secure configuration remain the customer\'s responsibility.',
      concepts: ['shared-responsibility'],
    },
  ],
};

export default lesson;
