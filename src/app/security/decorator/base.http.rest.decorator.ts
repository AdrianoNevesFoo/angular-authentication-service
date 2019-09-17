export function IdRest(route: string, headersResolve?: () => {}): MethodDecorator {
  return (target: () => {}, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = function routePrepare(...args: any[]) {

      if (!route) {
        throw new Error('@IdRest precisa de uma rota');
      }

      this.methodRoute = route;
      this.methodHeadersResolve = headersResolve;

      const result = originalMethod.apply(this, args);
      delete this.methodRoute;
      delete this.methodHeadersResolve;
      return result;
    };

    return descriptor;
  };
}
