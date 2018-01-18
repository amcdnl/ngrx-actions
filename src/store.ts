import { ensureStoreMetadata } from './internals';

export function Store<TState>(initialState?: TState): (target: Function) => void;
export function Store(initialState?: any): (target: Function) => void;
export function Store(initialState: any = {}) {
  return function(target: Function) {
    const meta = ensureStoreMetadata(target);
    meta.initialState = initialState;
  };
}
