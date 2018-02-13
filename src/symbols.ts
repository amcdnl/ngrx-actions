import { Action } from '@ngrx/store';

export type ActionType<T extends Action = Action | any> = { new (...args: any[]): T };
