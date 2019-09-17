export function RequestAuth(onlyAuth: boolean): MethodDecorator {
  return (target: () => {}, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      this.requireAuthIfExists = !!onlyAuth || true;

      const result = originalMethod.apply(this, args);
      delete this.requireAuthIfExists;
      return result;
    };

    return descriptor;
  };
}
