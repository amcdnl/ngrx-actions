import { INITIAL_STATE_KEY, ACTIONS_KEY } from './keys';
import { Action } from '@ngrx/store';
import { ActionsMeta } from './internals';

export function createReducer<TState = any>(store: {
  new (): any;
}): (state: TState, action: Action) => TState {
  const initialState = Reflect.getMetadata(INITIAL_STATE_KEY, store);
  const actions: ActionsMeta =
    Reflect.getMetadata(ACTIONS_KEY, store.prototype) || {};
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
