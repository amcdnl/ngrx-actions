import { ACTIONS_KEY } from './keys';

export function Action(...klasses: any[]) {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const meta = Reflect.getMetadata(ACTIONS_KEY, target) || [];
    for (const klass of klasses) {
      const inst = new klass();
      meta.push({
        action: klass,
        fn: name,
        type: inst.type
      });
    }
    Reflect.defineMetadata(ACTIONS_KEY, meta, target);
  };
}
