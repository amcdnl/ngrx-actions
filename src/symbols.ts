import { Action } from '@ngrx/store';

export type ActionType<T extends Action = Action> = { new (payload?: any): T };
