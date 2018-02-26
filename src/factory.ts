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
  const { initialState, actions, effects } = klass[NGRX_ACTIONS_META] as StoreMetadata;

  return function(state: any = initialState, action: Action) {
    const actionMeta = actions[action.type];
    if (actionMeta) {
      const result = instance[actionMeta.fn](state, action);
      if (result === undefined) {
        if (Array.isArray(state)) {
          return [...state];
        } else {
          return { ...state };
        }
      }
      state = result;
    }

    const effectMeta = effects[action.type];
    if (effectMeta) {
      instance[effectMeta.fn](state, action);
    }

    return state;
  };
}
