import { Injectable } from '@angular/core';
import { Store, Selector } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NgrxSelect {
  static store: Store<any> = undefined;
  connect(store: Store<any>) {
    NgrxSelect.store = store;
  }
}

export function Select<TState = any, TValue = any>(
  selector: Selector<TState, TValue>
): (target: any, name: string) => void;
export function Select<TState = any, TValue = any>(
  selectorOrFeature?: string,
  ...paths: string[]
): (target: any, name: string) => void;
export function Select<TState = any, TValue = any>(
  selectorOrFeature: string | Selector<TState, TValue>,
  ...paths: string[]
) {
  return function(target: any, name: string): void {
    let fn: Selector<TState, TValue>;
    // Nothing here? Use propery name as selector
    if (typeof selectorOrFeature === 'undefined') {
      selectorOrFeature = name;
    }
    // Handle string vs Selector<TState, TValue>
    if (typeof selectorOrFeature === 'string') {
      if (paths.length) {
        selectorOrFeature = [selectorOrFeature, ...paths].join('.');
      }
      fn = fastPropGetter(selectorOrFeature);
    } else {
      fn = selectorOrFeature;
    }
    // Redefine property
    if (delete target[name]) {
      Object.defineProperty(target, name, {
        get: () => {
          // get connected store
          const store = NgrxSelect.store;
          if (!store) {
            throw new Error('NgrxSelect not connected to store!');
          }
          return store.select(fn);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

/**
 * The generated function is faster then:
 * - pluck (Observable operator)
 * - memoize (old ngrx-actions implementation)
 * - MemoizedSelector (ngrx)
 * @param path
 */
function fastPropGetter(path: string): (x: any) => any {
  const segments = path.split('.');
  let seg = 'store.' + segments[0],
    i = 0,
    l = segments.length;
  let expr = seg;
  while (++i < l) {
    expr = expr + ' && ' + (seg = seg + '.' + segments[i]);
  }
  const fn = new Function('store', 'return ' + expr + '');
  return <(x: any) => any>fn;
}
