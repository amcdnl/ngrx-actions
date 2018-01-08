import { STORE_KEY } from './keys';

export function Store(initialState: any = {}) {
  return function(target: any) {
    Reflect.defineMetadata(STORE_KEY, initialState, target);
  };
}
