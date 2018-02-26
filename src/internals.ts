import { ActionType } from './symbols';

export const NGRX_ACTIONS_META = '__ngrx__actions__';

export interface StoreMetadata {
  initialState?: any;
  actions: ActionsMeta;
  effects: ActionsMeta;
}

export interface ActionMeta {
  action: ActionType;
  fn: string;
  type: string;
}

export type ActionsMeta = {
  [type: string]: ActionMeta;
};

export function ensureStoreMetadata(target: any): StoreMetadata {
  // see https://github.com/angular/angular/blob/master/packages/core/src/util/decorators.ts#L60
  if (!target.hasOwnProperty(NGRX_ACTIONS_META)) {
    const defaultMetadata: StoreMetadata = { actions: {}, effects: {} };
    Object.defineProperty(target, NGRX_ACTIONS_META, { value: defaultMetadata });
  }
  return target[NGRX_ACTIONS_META];
}
