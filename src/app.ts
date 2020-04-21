/*Decorators are functions

Decorators apply to classes, functions, methods, accessors (get, set), parameters

Order of operations - 
Decorator execution precedes a class constructor/instance

Decorators Factories -
Can customise decorators by giving them state through closures. Their scoped variables are accessible

Bottom up Order of Ops - 
Sequences of decorators are executed in a 'bottom up' fashion.
However, the factories execute in procedurally, i.e. line by line.



Property Decorators

What arguments a decorator gets depends onst where we use it. 

For properties we get: 
instance property: target (refers to prototype of object), propertyName
static property: target (refers to constructor), propertyName

decorator executes when JS registers your class declaration


Decorators Arguments


*/

function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  console.log(logString);
  return function (constructor: Function) {
    console.log(
      'Logger Decorator:\n\nLogging what I got from factory..\n\n' + logString
    );
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('WITHTEMPLATE FACTORY');
  return function (constructor: any) {
    console.log('WithTemplate Decorator');
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
    console.log('Class Instance!');
  }
}

const pers = new Person();
console.log(pers);

function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  private _price: number;
  constructor(public t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price');
    }
  }
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
