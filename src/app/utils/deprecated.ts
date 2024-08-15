export function deprecated(message: string = 'Function {name} is deprecated.') {
  return (instance, name: string, descriptor) => {
    const original = descriptor.value;
    const localMessage = message.replace('{name}', name);

    descriptor.value = function () {
      console.warn(localMessage);
      return original.apply(instance, arguments);
    };

    return descriptor;
  };
}
