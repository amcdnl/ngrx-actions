import { Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

import { ActionType } from './symbols';

export function ofAction<T extends Action>(allowedType: ActionType<T>): OperatorFunction<Action, T>;
export function ofAction<T extends Action>(...allowedTypes: ActionType[]): OperatorFunction<Action, T>;
export function ofAction(...allowedTypes: ActionType[]): OperatorFunction<Action, Action> {
  const allowedMap = {};
  allowedTypes.forEach(klass => (allowedMap[new klass().type] = true));
  return filter((action: Action) => {
    return allowedMap[action.type];
  });
}
