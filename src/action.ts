import { ensureStoreMetadata } from './internals';
import { ActionType } from './symbols';

export function Action(...actionsKlasses: ActionType[]) {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const meta = ensureStoreMetadata(target.constructor);

    for (const klass of actionsKlasses) {
      const inst = new klass();
      meta.actions[inst.type] = {
        action: klass,
        fn: name,
        type: inst.type
      };
    }
  };
}
