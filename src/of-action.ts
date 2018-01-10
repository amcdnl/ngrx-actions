import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter } from 'rxjs/operator/filter';
import { OperatorFunction, MonoTypeOperatorFunction } from 'rxjs/interfaces';

import { ActionType } from './symbols';

export function ofAction<T extends Action>(allowedType: ActionType<T>): MonoTypeOperatorFunction<T>;
export function ofAction<T extends Action>(...allowedTypes: ActionType[]): OperatorFunction<Action, T>;
export function ofAction<T extends Action>(...allowedTypes: ActionType[]): OperatorFunction<Action, T> {
  const allowedMap: { [type: string]: boolean } = {};
  allowedTypes.forEach(klass => (allowedMap[new klass().type] = true));
  return function(source$: Actions<T>): Actions<T> {
    return filter.call(source$, (action: Action) => {
      return allowedMap[action.type];
    });
  };
}
