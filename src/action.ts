import { ACTIONS_KEY } from './keys';
import { ActionsMeta } from './internals';
import { ActionType } from './symbols';

export function Action(...actionsKlasses: ActionType[]) {
  return function(
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    let metas: ActionsMeta = Reflect.getMetadata(ACTIONS_KEY, target);
    if (!metas) {
      Reflect.defineMetadata(ACTIONS_KEY, (metas = {}), target);
    }
    for (const klass of actionsKlasses) {
      const inst = new klass();
      metas[inst.type] = {
        action: klass,
        fn: name,
        type: inst.type,
      };
    }
  };
}
