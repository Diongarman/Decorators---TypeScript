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

What? This pattern works by returning something from a decorator that replaces the thing you added the decorator to, in this case the class. The replacer implements the old + new bespoke logic.

- Decorator Factory (DF) is given constructor (C-1) from class it is called upon
- C-1 is passed to Decorator
- Decorator 'changes' C-1 with a type generic function that returns an extended class
    -takes C-1
    -extends it with an annoymous class by adding bespoke logic
    -returns a class that extends C-1

The type generic used in Decorator is:
<T extends { new (..._: any[]): { name: string } }>

This is the criteria for any object that is desired to be passed as an argument to the decorator

This pattern allows execution on definition vs instantiation:
Programmer is able to run logic when the class is instantiated, in contrast to before when the decorator logic ran when the class was defined/



Other Decorator Return Types

Can return PropertyDescriptors on method decorators, this allows us to change the method and/or it's config. (Meta-programming)

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
      //'_' syntax tells TS we won't use this arg
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

// const pers = new Person();
// console.log(pers);

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
  //Property decorator
  @Log
  title: string;
  private _price: number;
  constructor(public t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  //Accessor decorator
  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price');
    }
  }
  //Method decorator
  @Log3
  //Parameter decorator
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
function Autobind(
  _target: any,
  _name: string,
  propertyDescriptor: PropertyDescriptor
) {
  const originalMethod = propertyDescriptor.value;
  const mutatedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      //this refers to the concrete object that calls it
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return mutatedDescriptor;
}

class Printer {
  message = 'This works';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}
let p = new Printer();

let button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);

interface ValidConfig {
  [property: string]: {
    [validatableProp: string]: string[]; //['required'], ['positive']
  };
}

const registeredValidators: ValidConfig = {};

function validationRegisterHelper(
  target: any,
  propName: string,
  validationToAdd: string
) {
  const constructorName = target.constructor.name;
  const propList = registeredValidators[constructorName];

  let validators;
  if (!propList || !propList[propName]) {
    validators = [validationToAdd];
  } else {
    validators = [...propList[propName], validationToAdd];
  }

  registeredValidators[constructorName] = {
    ...propList,
    [propName]: validators,
  };
  console.log(registeredValidators[constructorName]);
}

function Require(target: any, propName: string) {
  validationRegisterHelper(target, propName, 'required');
}

function PositiveNumber(target: any, propName: string) {
  validationRegisterHelper(target, propName, 'positive');
}

//

function Validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];

  console.log(registeredValidators);

  let isvalid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isvalid = isvalid && !!obj[prop];
          break;
        case 'positive':
          isvalid = isvalid && obj[prop] > 0;
          break;
      }
    }
  }

  return isvalid;
}

class Course {
  @Require
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!Validate(createdCourse)) {
    alert('Invalid input');
    return;
  }

  console.log(createdCourse);
});
