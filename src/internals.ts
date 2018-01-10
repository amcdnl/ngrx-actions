import { Action } from '@ngrx/store';

export interface ActionMeta {
  action: { new (...args: any[]): Action };
  fn: string;
  type: string;
}

export type ActionsMeta = {
  [type: string]: ActionMeta;
};
