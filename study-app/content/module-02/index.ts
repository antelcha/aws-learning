import type { Module } from '../../src/engine/types';
import boss from './boss';
import lesson01 from './lesson-01';
import lesson02 from './lesson-02';
import lesson03 from './lesson-03';
import lesson04 from './lesson-04';
import lesson05 from './lesson-05';
import lesson06 from './lesson-06';
import lesson07 from './lesson-07';
import lesson08 from './lesson-08';

const module02: Module = {
  id: 'module-02',
  number: 2,
  title: 'Compute in the Cloud',
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07, lesson08],
  locked: [],
  boss,
};

export default module02;
