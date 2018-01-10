import { Injectable } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';
import { memoize } from './memoize';

@Injectable()
export class NgrxSelect {
  static store: Store<any> = undefined;
  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

export function Select(selector?: string | MemoizedSelector<object, any> | { (state: object): any }): any {
  return function(target: any, name: string, descriptor: TypedPropertyDescriptor<any>): void {
    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => {
          if (!NgrxSelect.store) {
            throw new Error('NgrxSelect not connected to store!');
          }

          if (typeof selector === 'function') {
            return NgrxSelect.store.select(selector);
          }

          if (typeof selector === 'string' || typeof selector === 'undefined') {
            const fn = memoize(state => getValue(state, selector || name));
            return NgrxSelect.store.select(fn);
          }
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

function getValue(state, prop: string) {
  if (prop) {
    return prop.split('.').reduce((acc, part) => acc && acc[part], state);
  }
  return state;
}
