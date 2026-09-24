import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l3-provision',
  module: 'module-02',
  order: 3,
  title: 'How to Provision AWS Resources',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/03-How-to-Provision-AWS-Resources.md',
  keyIdea: [
    'In AWS, everything is an API call. The Management Console, the CLI, and the SDKs all call the same APIs.',
    'The console suits learning, test environments, bills, and monitoring; repeated manual launches invite mistakes.',
    'The CLI and SDKs enable scripting and automation, which make deployments predictable.',
    'EC2 is unmanaged: the customer manages the guest OS, updates, and security groups.',
  ],
  questions: [
    {
      id: 'm2-l3-q1',
      type: 'single',
      prompt:
        'A team launches 20 identical instances every Monday through the console. One week, an instance gets the wrong security group. What is the best fix?',
      options: [
        { id: 'a', text: 'Add a second person to review each console launch' },
        { id: 'b', text: 'Script the launch once with the CLI or an SDK and run it on a schedule' },
        { id: 'c', text: 'Launch the instances from a larger instance type' },
      ],
      answer: ['b'],
      hint: 'The root cause is repeating a manual process.',
      explanation:
        'A script defines the configuration, including the security group, once; every run is identical and the script can be reviewed and version-controlled.',
      concepts: ['aws-apis', 'automation'],
    },
    {
      id: 'm2-l3-q2',
      type: 'single',
      prompt: 'What is the main advantage of the AWS CLI over the Management Console?',
      options: [
        { id: 'a', text: 'A visual interface that is easier for one-time tasks' },
        { id: 'b', text: 'Scripting and automation that reduce manual steps and errors' },
        { id: 'c', text: 'Access to AWS APIs the console cannot call' },
      ],
      answer: ['b'],
      hint: 'Both call the same APIs; what differs is how you repeat the work.',
      explanation: 'The CLI enables automation and scripting. Both tools call the same APIs; the console is the visual one.',
      concepts: ['aws-apis', 'automation'],
    },
    {
      id: 'm2-l3-q3',
      type: 'single',
      prompt: 'Who patches the guest operating system on an EC2 instance?',
      options: [
        { id: 'a', text: 'AWS, as with every service' },
        { id: 'b', text: 'The customer, because EC2 is an unmanaged service' },
      ],
      answer: ['b'],
      hint: 'Is EC2 managed or unmanaged?',
      explanation:
        'EC2 is unmanaged, so the customer patches the guest OS. AWS patches the physical host and hypervisor; on a managed service such as Amazon RDS, AWS patches the database operating system.',
      concepts: ['managed-vs-unmanaged', 'shared-responsibility'],
    },
  ],
};

export default lesson;
