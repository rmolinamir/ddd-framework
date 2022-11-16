import assert from 'assert';
import { ObjectLiteral } from '../types';

type Newable = { new (...args: any[]): ObjectLiteral };

type ObserveHandler<Thing> = (instance: Thing, newValue: unknown) => void;

type Observed<Thing> = Thing & {
  __observers: Observer<Thing>[];
};

class Observer<Thing> {
  private handler: ObserveHandler<Thing>;

  private propertyKey: PropertyKey;

  private observed: Thing | null = null;

  constructor(handler: ObserveHandler<Thing>, propertyKey: PropertyKey) {
    this.handler = handler;
    this.propertyKey = propertyKey;
  }

  /**
   * Sets a reference to the observed Thing object.
   */
  public setup(observed: Thing) {
    this.observed = observed;
  }

  /**
   * Starts observing the observed Thing object property.
   */
  public start() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    assert(
      self.observed,
      `Cannot use the Observe property decorator without it being set up by the Inject class decorator.`
    );

    const thingInstance = self.observed;

    const backingField = `_${self.propertyKey.toString()}`;
    const initialValue = (thingInstance as Record<PropertyKey, unknown>)[
      self.propertyKey
    ];

    Reflect.defineProperty(thingInstance as ObjectLiteral, backingField, {
      configurable: false,
      enumerable: false,
      value: initialValue,
      writable: true
    });

    Reflect.defineProperty(thingInstance as ObjectLiteral, self.propertyKey, {
      get() {
        return (thingInstance as Record<PropertyKey, unknown>)[backingField];
      },
      set(newValue) {
        (thingInstance as Record<PropertyKey, unknown>)[backingField] =
          newValue;

        self.handler(thingInstance, newValue);
      },
      configurable: false,
      enumerable: true
    });
  }
}

export default class Observable {
  /**
   * Injects into the decorated class, then sets and starts the observers of its decorated properties in the constructor.
   */
  public static Inject<ClassType extends Newable>(): ClassDecorator {
    return function (Class: ClassType) {
      return class extends Class {
        constructor(...args: any[]) {
          super(...args);

          const thingInstance = this as Observed<InstanceType<ClassType>>;

          assert(
            thingInstance.__observers,
            `Should not use the Inject class decorator without Observed property decorators.`
          );

          for (const observer of thingInstance.__observers) {
            observer.setup(thingInstance);
            observer.start();
          }
        }
      };
    } as ClassDecorator;
  }

  /**
   * Observe a property and execute the handler whenever it changes.
   * This transforms the property into a getter/setter with an innumerable backing field.
   */
  public static Observe<Thing>(
    handler: ObserveHandler<Thing>
  ): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    /**
     * This function only runs once at runtime to set up the targetClass property descriptor.
     * In this case, we are basically setting up a setter, getter, and a private backing field property.
     *
     * NOTE:
     *
     * - All instances share the same `targetClass` variable, and it refers to the `Thing` class.
     * - The `this` keyword inside the getters and setters will refer the instances of `Thing`.
     */
    return function (
      targetClass: ObjectLiteral,
      propertyKey: PropertyKey
    ): void {
      self.ensureIsObserved(targetClass as Thing);

      self.registerObserverOn(
        targetClass as Observed<Thing>,
        new Observer<Thing>(handler, propertyKey)
      );
    };
  }

  private static ensureIsObserved<Thing>(thing: Thing): void {
    const observedThing = thing as Observed<Thing>;

    if (!observedThing.__observers) observedThing.__observers = [];
  }

  private static registerObserverOn<Thing>(
    thing: Observed<Thing>,
    observer: Observer<Thing>
  ): void {
    thing.__observers.push(observer);
  }
}
