/*Decorators are functions

Decorators apply to classes, functions, methods, accessors (get, set), parameters

Order of operations - 
Decorator execution precedes a class constructor/instance

Decorators Factories -
Can customise decorators by giving them state through closures. Their scoped variables are accessible

Bottom up Order of Ops - 
Sequences of decorators are executed in a 'bottom up' fashion (Kind of, see execution pattern below)

Decorators Arguments


*/

function Logger(logString: string) {
  console.log("From Factory 'Logger':");
  console.log(logString);
  return function (constructor: Function) {
    console.log(
      "Decorator from 'Logger':\n\nLogging what I got from factory..\n\n" +
        logString
    );
    console.log("Decorator from 'Logger': \n\n", constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log("From Factory 'WithTemplate':");
  return function (constructor: any) {
    console.log("Decorator from 'WithTemplate'");
    let hookEl = document.getElementById(hookId);
    let p = new constructor();

    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}

@Logger('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Dion';
  constructor() {
    console.log('From Class Instance!');
  }
}

const pers = new Person();
console.log(pers);
