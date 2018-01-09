import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { memoize } from './memoize';

@Injectable()
export class NgrxSelect {
  static store: Store<any> = undefined;
  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

export function Select(path?: string): any {
  return function(
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ): void {
    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => {
          if (!NgrxSelect.store) {
            throw new Error('NgrxSelect not connected to store!');
          }

          const fn = memoize(state => getValue(state, path || name));
          return NgrxSelect.store.select(fn);
        },
        enumerable: true,
        configurable: true,
      });
    }
  };
}

function getValue(state, prop: string) {
  if (prop)
    return prop.split('.').reduce((acc, part) => acc && acc[part], state);
  return state;
}
