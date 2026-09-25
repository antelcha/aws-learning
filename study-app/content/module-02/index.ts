import type { Module } from '../../src/engine/types';
import boss from './boss';
import lesson01 from './lesson-01';
import lesson02 from './lesson-02';
import lesson03 from './lesson-03';
import lesson04 from './lesson-04';
import lesson05 from './lesson-05';

const reason = 'Not watched yet. Content and the simulation are added after the lesson so they match the course.';

const module02: Module = {
  id: 'module-02',
  number: 2,
  title: 'Compute in the Cloud',
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05],
  locked: [
    { order: 6, title: 'Scaling Amazon EC2', reason },
    { order: 7, title: 'Directing Traffic with Elastic Load Balancing', reason },
    { order: 8, title: 'Messaging and Queuing', reason },
  ],
  boss,
};

export default module02;
