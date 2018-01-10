import { Action } from '@ngrx/store';

export type ActionType = { new (...args: any[]): Action };
