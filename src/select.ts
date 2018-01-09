import { Injectable } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';

@Injectable()
export class NgrxSelect {
  static store: any = undefined;

  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

export function Select(
  selector?: string | MemoizedSelector<object, any> | { (state: object): any }
): any {
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

          if (typeof selector === 'function') {
            return NgrxSelect.store.select(selector);
          }

          if (typeof selector === 'string' || typeof selector === 'undefined') {
            // If user want to memoize prop, just use createSelector approach
            return NgrxSelect.store.select(...getValue(selector || name));
          }
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

function getValue(propPath: string) {
  return propPath.split('.');
}
