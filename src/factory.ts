import { Action } from '@ngrx/store';
import { NGRX_ACTIONS_META, StoreMetadata } from './internals';

export function createReducer<TState = any>(store: {
  new (...args: any[]): any;
}): (state: TState, action: Action) => TState {
  if (!store.hasOwnProperty(NGRX_ACTIONS_META)) {
    throw new Error('A reducer can be created from a @Store decorated class only.');
  }
  const { initialState, actions } = store[NGRX_ACTIONS_META] as StoreMetadata;

  const instance = new store();

  return function(state: any = initialState, action: Action) {
    const meta = actions[action.type];
    if (meta) {
      const result = instance[meta.fn](state, action);
      if (result === undefined) {
        if (Array.isArray(state)) {
          return [...state];
        } else {
          return { ...state };
        }
      }
      return result;
    }
    return state;
  };
}
