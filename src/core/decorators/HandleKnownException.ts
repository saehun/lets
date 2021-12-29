import { handleErrorAndExit } from '../error';

export function HandleKnownException(): MethodDecorator {
  return (_, __, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await fn.apply(this, args);
      } catch (e) {
        handleErrorAndExit(e);
      }
    };
  };
}
