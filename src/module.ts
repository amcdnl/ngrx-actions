import { NgModule, InjectionToken, ModuleWithProviders, Injector, Inject, Optional } from '@angular/core';
import { Store, StoreModule, ReducerManager, combineReducers } from '@ngrx/store';

import { NgrxSelect } from './select';
import { createReducer } from './factory';

export const STORE_TOKEN = new InjectionToken<any>('STORE_TOKEN');
export const FEATURE_STORE_TOKEN = new InjectionToken<any>('FEATURE_STORE_TOKEN');

@NgModule({
  imports: [StoreModule],
  providers: [NgrxSelect]
})
export class NgrxActionsModule {
  static forRoot(reducers: any): ModuleWithProviders {
    return {
      ngModule: NgrxActionsModule,
      providers: [
        {
          provide: STORE_TOKEN,
          useValue: reducers
        }
      ]
    };
  }

  static forFeature(key: any, reducers?: any): ModuleWithProviders {
    return {
      ngModule: NgrxActionsModule,
      providers: [
        {
          provide: FEATURE_STORE_TOKEN,
          useValue: { key, reducers }
        }
      ]
    };
  }

  constructor(
    @Optional()
    @Inject(STORE_TOKEN)
    reducers: any,
    @Optional()
    @Inject(FEATURE_STORE_TOKEN)
    featureReducers: any,
    reducerFactory: ReducerManager,
    store: Store<any>,
    parentInjector: Injector,
    select: NgrxSelect
  ) {
    select.connect(store);

    if (reducers) {
      for (const key in reducers) {
        const klass = reducers[key];
        const inst = parentInjector.get(klass, new klass());
        reducerFactory.addReducer(key, createReducer(inst));
      }
    }

    if (featureReducers) {
      if (typeof featureReducers.key !== 'string') {
        featureReducers.reducers = featureReducers.key;
        featureReducers.key = undefined;
      }

      const mapped = {};
      for (const key in featureReducers.reducers) {
        const klass = featureReducers.reducers[key];
        const inst = parentInjector.get(klass, new klass());
        mapped[key] = createReducer(inst);
      }

      if (featureReducers.key) {
        reducerFactory.addFeature({
          reducers: mapped,
          reducerFactory: <any>combineReducers,
          key: featureReducers.key
        });
      }
    }
  }
}
