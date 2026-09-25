import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm2-l8-messaging',
  module: 'module-02',
  order: 8,
  title: 'Messaging and Queuing',
  note: '../AWS-Cloud-Practitioner/02-Compute-in-the-Cloud/08-Messaging-and-Queuing.md',
  keyIdea: [
    'Tightly coupled components call each other directly, so one failure cascades; loosely coupled components talk through a buffer, so a failure stays isolated.',
    'Amazon SQS is a message queue: a message waits until a consumer retrieves it, processes it, and deletes it. The data inside is the payload.',
    'Amazon SNS is publish-subscribe: a message sent to a topic is pushed right away to every subscriber, such as email, SMS, mobile push, or a Lambda function.',
    'Amazon EventBridge routes events from apps, AWS services, and third-party software to targets, and holds an event if a target is unavailable.',
  ],
  sim: { id: 'messaging' },
  questions: [
    {
      id: 'm2-l8-q1',
      type: 'single',
      prompt:
        'A bank\'s fraud detection service is sometimes down for a few minutes. Transactions sent to it during that time must not be lost and should be checked once it is back. What fits?',
      options: [
        { id: 'a', text: 'Call the fraud service directly and fail the transaction if it does not answer' },
        { id: 'b', text: 'Put an Amazon SQS queue between the transaction service and the fraud service' },
        { id: 'c', text: 'Publish each transaction to an Amazon SNS topic that the fraud service subscribes to' },
      ],
      answer: ['b'],
      hint: 'Which option keeps each message until the consumer is available again?',
      explanation:
        'SQS stores each message, with its payload, until the fraud service retrieves and processes it, so the two services are loosely coupled. A direct call is tightly coupled; SNS pushes messages immediately and does not keep them for later pickup.',
      concepts: ['sqs', 'loose-coupling'],
    },
    {
      id: 'm2-l8-q2',
      type: 'single',
      prompt:
        'An online store sends every customer one long email with all updates. Customers want to receive only the updates they choose, such as new products or special offers. What fits?',
      options: [
        { id: 'a', text: 'One Amazon SQS queue that every customer reads' },
        { id: 'b', text: 'Amazon SNS topics per update type that customers subscribe to' },
        { id: 'c', text: 'A larger instance for the email server' },
      ],
      answer: ['b'],
      hint: 'Publishers send to topics; who receives the message?',
      explanation:
        'With SNS, the store publishes to a topic per update type, and each customer subscribes only to the topics they want. An SQS message is processed and deleted by a consumer, not delivered to many subscribers.',
      concepts: ['sns'],
    },
    {
      id: 'm2-l8-q3',
      type: 'single',
      prompt:
        'In a food delivery app, an "order placed" event must reach the payment, restaurant, and delivery services, each working independently. If one of them is briefly down, the event should be delivered when it is back. Which service is built for routing events like this?',
      options: [
        { id: 'a', text: 'Amazon EventBridge' },
        { id: 'b', text: 'Elastic Load Balancing' },
        { id: 'c', text: 'Amazon EC2 Auto Scaling' },
      ],
      answer: ['a'],
      hint: 'Which service receives, filters, and delivers events to other applications?',
      explanation:
        'EventBridge routes events from apps and services to targets, and stores an event for a target that is unavailable until it can be delivered. ELB spreads requests across instances; Auto Scaling changes the number of instances.',
      concepts: ['eventbridge', 'loose-coupling'],
    },
  ],
};

export default lesson;
