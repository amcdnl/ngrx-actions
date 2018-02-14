import { ensureStoreMetadata } from './internals';
import { ActionType } from './symbols';

export function Action(...actionsKlasses: ActionType[]) {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const meta = ensureStoreMetadata(target.constructor);

    for (const klass of actionsKlasses) {
      const inst = new klass();
      const type = inst.type;

      if (meta.actions[type]) {
        throw new Error(
          `@Action for '${type}' is defined multiple times in functions '${meta.actions[type].fn}' and '${name}'`
        );
      }

      meta.actions[type] = {
        action: klass,
        fn: name,
        type
      };
    }
  };
}
