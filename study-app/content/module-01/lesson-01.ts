import type { Lesson } from '../../src/engine/types';

const lesson: Lesson = {
  id: 'm1-l1-client-server',
  module: 'module-01',
  order: 1,
  title: 'Client–Server Model',
  note: '../AWS-Cloud-Practitioner/01-Introduction-to-Cloud/01-Client-Server-Model.md',
  keyIdea: [
    'A client starts the interaction by sending a request.',
    'A server receives the request, processes it, and sends back a response.',
    'A response is not always a success: an error is also a response.',
    'Coffee shop analogy: customer = client, barista = server, order = request, coffee = response.',
  ],
  questions: [
    {
      id: 'm1-l1-q1',
      type: 'single',
      prompt:
        'A mobile app asks a server for a product that was deleted. The server replies "product not found". What happened in client–server terms?',
      options: [
        { id: 'a', text: 'The request failed, so no response was sent' },
        { id: 'b', text: 'The server sent a response that reports an error' },
        { id: 'c', text: 'The server became the client for this interaction' },
        { id: 'd', text: 'The client sent a response to the server' },
      ],
      answer: ['b'],
      hint: 'In the coffee shop, what does the barista give you when your drink is unavailable?',
      explanation:
        'The server still processed the request and returned a response; that response happens to be an error. A response does not always mean success.',
      concepts: ['client-server'],
    },
    {
      id: 'm1-l1-q2',
      type: 'single',
      prompt: 'In the coffee shop analogy, which role starts the interaction?',
      options: [
        { id: 'a', text: 'The barista, by preparing drinks in advance' },
        { id: 'b', text: 'The customer, by placing an order' },
        { id: 'c', text: 'The coffee, by being delivered' },
      ],
      answer: ['b'],
      hint: 'Which side of client–server sends the request?',
      explanation: 'The client (customer) initiates by sending a request (the order). The server (barista) responds.',
      concepts: ['client-server'],
    },
  ],
};

export default lesson;
