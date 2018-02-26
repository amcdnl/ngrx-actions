import { ActionType } from './symbols';
import { ensureStoreMetadata } from './internals';

export function Effect(...effectKlasses: ActionType[]) {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const meta = ensureStoreMetadata(target.constructor);

    for (const klass of effectKlasses) {
      const inst = new klass();
      const type = inst.type;

      if (meta.effects[type]) {
        throw new Error(
          `@Effect for '${type}' is defined multiple times in functions '${meta.effects[type].fn}' and '${name}'`
        );
      }

      meta.effects[type] = {
        action: klass,
        fn: name,
        type
      };
    }
  };
}
