import { INITIAL_STATE_KEY } from './keys';

export function Store<TState extends object>(initialState?: TState): (target: Function) => void;
export function Store(initialState?: object): (target: Function) => void;
export function Store(initialState: object = {}) {
  return function(target: Function) {
    Reflect.defineMetadata(INITIAL_STATE_KEY, initialState, target);
  };
}
