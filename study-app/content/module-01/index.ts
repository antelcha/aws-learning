import type { Module } from '../../src/engine/types';
import boss from './boss';
import lesson01 from './lesson-01';
import lesson02 from './lesson-02';
import lesson03 from './lesson-03';
import lesson04 from './lesson-04';
import lesson05 from './lesson-05';
import lesson06 from './lesson-06';

const module01: Module = {
  id: 'module-01',
  number: 1,
  title: 'Introduction to Cloud',
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06],
  locked: [],
  boss,
};

export default module01;
