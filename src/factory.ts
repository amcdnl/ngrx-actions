import { Action } from '@ngrx/store';
import { NGRX_ACTIONS_META, StoreMetadata } from './internals';

export function createReducer<TState = any>(
  store:
    | {
        new (...args: any[]): any;
      }
    | any
): (state: TState, action: Action | any) => TState {
  const isInstance = !store.prototype;
  const klass = isInstance ? store.constructor : store;

  if (!klass.hasOwnProperty(NGRX_ACTIONS_META)) {
    throw new Error('A reducer can be created from a @Store decorated class only.');
  }

  const instance = isInstance ? store : new store();
  const { initialState, actions } = klass[NGRX_ACTIONS_META] as StoreMetadata;

  return function(state: any = initialState, action: Action) {
    const meta = actions[action.type || action.constructor.name];
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
