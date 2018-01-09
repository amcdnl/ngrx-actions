import { Action } from '@ngrx/store';

export type ActionType = { new (): Action };

export interface ActionMeta {
  action: { new (): Action };
  fn: string;
  type: string;
}

export type ActionsMeta = {
  [type: string]: ActionMeta;
};
