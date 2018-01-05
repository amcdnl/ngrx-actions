import { Action } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { filter } from 'rxjs/operator/filter';

export function ofAction<T extends Action>(...allowedTypes: any[]) {
  return function ofTypeOperator(source$: Actions<T>): Actions<T> {
    return filter.call(source$, (action: any) => {
      return allowedTypes.some(a => {
        const inst = new a();
        return inst.type === action.type;
      });
    });
  };
}
