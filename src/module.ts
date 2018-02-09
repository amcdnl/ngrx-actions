import { NgModule } from '@angular/core';
import { NgrxSelect } from './select';
import { Store } from '@ngrx/store';

@NgModule({
  providers: [NgrxSelect]
})
export class NgrxActionsModule {
  constructor(store: Store<any>, select: NgrxSelect) {
    select.connect(store);
  }
}
