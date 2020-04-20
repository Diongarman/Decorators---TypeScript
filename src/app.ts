/*Decorations are functions

they apply to classes, functions, methods, accessors (get, set), parameters

Decorators Arguments


*/

function Logger(constructor: Function) {
  console.log('Logging..');
  console.log(constructor);
}

@Logger()
class Person {
  name = 'Dion';
  constructor() {
    console.log('Creating Person...');
  }
}

const pers = new Person();
console.log(pers);
