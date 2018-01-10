import { INITIAL_STATE_KEY } from './keys';
import { Action } from '@ngrx/store';

export function Store<TState>(initialState?: TState): (target: Function) => void;
export function Store(initialState?: any): (target: Function) => void;
export function Store(initialState: any = {}) {
  return function(target: Function) {
    Reflect.defineMetadata(INITIAL_STATE_KEY, initialState, target);
  };
}
