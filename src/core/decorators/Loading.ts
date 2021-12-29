import chalk from 'chalk';
import is from '@sindresorhus/is';
import ora from 'ora';

export function Loading(fn: (args: any) => string): MethodDecorator {
  return (target, __, descriptor: PropertyDescriptor) => {
    const originalFn = descriptor.value;

    descriptor.value = function (...args: Parameters<typeof originalFn>): ReturnType<typeof originalFn> {
      const name = this['name'] ?? target.constructor.name;
      const spinner = ora(`${chalk.grey(name)} - ${fn(args)}`).start();
      try {
        const result = originalFn.apply(this, args);
        if (is.promise(result)) {
          return result.then(v => {
            spinner.succeed();
            return v;
          });
        } else {
          spinner.succeed();
          return result;
        }
      } catch (e) {
        spinner.fail();
        throw e;
      }
    };
  };
}
