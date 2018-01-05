import 'reflect-metadata';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter } from 'rxjs/operator/filter';

const STORE_KEY = '$STORE';
const ACTIONS_KEY = '$ACTIONS';

export function Store(initialState: any = {}) {
  return function(target: any) {
    Reflect.defineMetadata(STORE_KEY, initialState, target);
  }
}

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
            return [ ...state ];
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

export function ofAction<T extends Action>(...allowedTypes: any[]) {
  return function ofTypeOperator(source$: Actions <T>): Actions <T> {
    return filter.call(source$, (action: any) => {
      return allowedTypes.some(a => {
        const inst = new a();
        return inst.type === action.type;
      });
    });
  };
}

let store;
export const ngrxSelect = (s => store = s);

export function Select(path?: string): any {
  return function (target: any, name: string, descriptor: TypedPropertyDescriptor <any>): void {
    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => store.select(state => getValue(state, path || name)),
        enumerable: true,
        configurable: true
      });
    }
  };
}

function getValue(state, prop) {
  if (prop) return prop.split('.').reduce((acc, part) => acc && acc[part], state);
  return state;
}