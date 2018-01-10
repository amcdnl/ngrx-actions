import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, MemoizedSelector, Store } from '@ngrx/store';

@Injectable()
export class NgrxSelect {
  static store: Store<any> | undefined = undefined;
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
            const fn = getSelector(selector || name);
            return NgrxSelect.store.select(fn!);
          }
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}

function getSelector(propPath: string) {
  const props = propPath.split('.');
  if (!props[0]) {
    throw new Error('Property to select from store cannot be an empty string');
  }
  if (props[0] && props.length === 1) {
    return createFeatureSelector(props[0]);
  } else if (props[0] && props.length > 1) {
    const [featureName, ...propNames] = props;
    const getFeature = createFeatureSelector(featureName);
    return propNames.reduce((selected, prop) => createSelector(selected, (state: object) => state[prop]), getFeature);
  }
}
