/*Decorators are functions

Decorators apply to classes, functions, methods, accessors (get, set), parameters

Order of operations - 
Decorator execution precedes a class constructor/instance

Decorators Factories -
Can customise decorators by giving them state through closures. Their scoped variables are accessible



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

function WithTemplate(template: string, hookId: string) {
  //'_' parameter signifies that argument is passed in but not utilised
  return function (_: Function) {
    let hookEl = document.getElementById(hookId);

    if (hookEl) {
      hookEl.innerHTML = template;
    }
  };
}

// @Logger('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Dion';
  constructor() {
    console.log('From Class Instance:\n\nCreating Person...');
  }
}

const pers = new Person();
console.log(pers);
