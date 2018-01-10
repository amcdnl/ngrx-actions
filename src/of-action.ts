import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { OperatorFunction } from 'rxjs/interfaces';

export function ofAction<T extends Action>(allowedType: { new (): T }): OperatorFunction<Action, T>;
export function ofAction<T extends Action>(...allowedTypes: { new (): Action }[]): OperatorFunction<Action, Action>;
export function ofAction(...allowedTypes: { new (): Action }[]): OperatorFunction<Action, Action> {
  const allowedMap = {};
  allowedTypes.forEach(klass => (allowedMap[new klass().type] = true));
  return filter((action: Action) => {
    return allowedMap[action.type];
  });
}
