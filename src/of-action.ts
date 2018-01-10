import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { OperatorFunction } from 'rxjs/interfaces';
import { ActionType } from '.';

export function ofAction<T extends Action>(allowedType: ActionType<T>): OperatorFunction<Action, T>;
export function ofAction<T extends Action>(...allowedTypes: ActionType[]): OperatorFunction<Action, T>;
export function ofAction(...allowedTypes: ActionType[]): OperatorFunction<Action, Action> {
  const allowedMap = {};
  allowedTypes.forEach(klass => (allowedMap[new klass().type] = true));
  return filter((action: Action) => {
    return allowedMap[action.type];
  });
}
