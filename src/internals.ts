import { Action } from '@ngrx/store';
import { ActionType } from './symbols';

export interface ActionMeta {
  action: ActionType;
  fn: string;
  type: string;
}

export type ActionsMeta = {
  [type: string]: ActionMeta;
};
