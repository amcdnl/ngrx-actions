import { STORE_KEY, ACTIONS_KEY } from './keys';

export function createReducer(klass: any) {
  const initialState = Reflect.getMetadata(STORE_KEY, klass);
  const actions = Reflect.getMetadata(ACTIONS_KEY, klass.prototype);
  const instance = new klass();

  return function(state: any = initialState, action: any) {
    if (actions) {
      const meta = actions.find(a => a.type === action.type);
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
    }
    return state;
  };
}
