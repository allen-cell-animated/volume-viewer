/**
 * Sleeps async for a given amount of time.
 * @param milisec
 * @returns
 */
function asyncDelay(milisec: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milisec);
  });
}

/**
 * Generates a random int within the max and min range.
 * Maximum is exclusive and minimum is inclusive.
 * @param min
 * @param max
 */
export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));

/**
 * Will throttle a method by a fixed ms time, if number is passed.
 * if tuple, will throttle by a random time (ms) between each.
 * @param milliseconds
 * @returns
 */
//////////////////
// TODO THIS IS OLD DECORATOR SYNTAX AND DOESNT SEEM TO WORK ANYMORE
// REQUIRES CAREFUL VERSIONING OF TYPESCRIPT AND BABEL PLUGINS
//////////////////
function throttle(milliseconds: number | [number, number]): any {
  let lastCall = 0;
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const now = Date.now();
      if (!lastCall) {
        lastCall = now;
        return originalMethod.apply(this, args);
      }
      const ms = Array.isArray(milliseconds)
        ? getRandomInt(milliseconds[0], milliseconds[1])
        : Math.round(milliseconds);

      const diff = now - lastCall;
      if (diff < ms) {
        await asyncDelay(ms - diff);
      }
      lastCall = Date.now();
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
