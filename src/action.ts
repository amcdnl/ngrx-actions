import { ensureStoreMetadata } from './internals';
import { ActionType } from './symbols';

export function Action(...actionsKlasses: ActionType[]) {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const meta = ensureStoreMetadata(target.constructor);

    for (const klass of actionsKlasses) {
      const inst = new klass();
      if (meta.actions[inst.type]) {
        throw new Error(
          `@Action for '${inst.type}' is defined multiple times in functions '${
            meta.actions[inst.type].fn
          }' and '${name}'`
        );
      }
      meta.actions[inst.type] = {
        action: klass,
        fn: name,
        type: inst.type
      };
    }
  };
}
