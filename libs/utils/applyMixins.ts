/**
 * @description This method is used to extend a class to have properties
 * of multiple classes.
 * @param baseClass The base class.
 * @param extendedClasses The extensions to add to the base class.
 */
export const applyMixins = (baseClass: any, extendedClasses: any[]) => {
  extendedClasses.forEach((extendedClass) => {
    Object.getOwnPropertyNames(extendedClass.prototype).forEach((name) => {
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) ||
          Object.create(null),
      );
    });
  });

  return baseClass;
};
