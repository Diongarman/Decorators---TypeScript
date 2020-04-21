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

For accessors we get:
target (prototype if instance accessor, constructor if static accessor)
name
descriptor - a TS type named PropertyDescriptor


For methods we get:
target (prototype if instance accessor, constructor if static accessor)
name
descriptor - a TS type named PropertyDescriptor --> Object is slightly different from accessor 


For parameters we get:

target
name - the name of the method of the parameter being decorated
position - The position number of the parameter


Execution of Decorators
decorator executes when JS registers your class declaration




Decorators Arguments


When Do Decorators Execute?

On class definition as opposed to run time. The idea behind decorators as meta-programming tool.


Returning (and changing) A Class In Class Decorators

- Decorator Factory (DF) is given constructor (C-1) from class it is called upon
- C-1 is passed to Decorator
- Decorator 'changes' C-1 with a type generic function
    -takes C-1
    -extends it with an annoymous class by adding bespoke logic
    -returns a class that extends C-1

The type generic used in Decorator is:
<T extends { new (..._: any[]): { name: string } }>

This is the criteria for any object that is desired to be passed as an argument to the decorator

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

type DecoratorCriteria = {
  new (..._: any[]): { name: string };
};

function WithTemplate(template: string, hookId: string) {
  console.log('WITHTEMPLATE FACTORY');
  return function <T extends DecoratorCriteria>(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log('WithTemplate Decorator');
        let hookEl = document.getElementById(hookId);

        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
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

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor Decorator');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | symbol,
  descriptor: PropertyDescriptor
) {
  console.log('Method Decorator');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter Decorator');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;
  constructor(public t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price');
    }
  }
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
