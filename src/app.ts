/*Decorations are functions

they apply to classes, functions, methods, accessors (get, set), parameters

Decorators Arguments


*/

function Logger(logString: string) {
  console.log("From Decorator Factory to customise decorator 'composed' with:");
  console.log(logString);
  return function (constructor: Function) {
    console.log(
      'From Decorator:\n\nLogging what I got from factory..\n\n' + logString
    );
    console.log('From Decorator: \n\n', constructor);
  };
}

@Logger('LOGGING - PERSON')
class Person {
  name = 'Dion';
  constructor() {
    console.log('From Class Instance:\n\nCreating Person...');
  }
}

const pers = new Person();
console.log(pers);
