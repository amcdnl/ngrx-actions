# 2.0.4 - 1/7/17
- Feature: Memoize Select

# 2.0.3 - 1/7/17
- Fix: Build tweaks

# 2.0.2 - 1/7/17
- Chore: Add error handling for select connect

# 2.0.1 - 1/7/17
- Chore: Better builds

# 2.0.0 - 1/5/17
- Feature: Implied select name from property name
- BREAKING: Add module for proper DI of selects

Instead of:
```javascript
import { ngrxSelect } from 'ngrx-actions';

@NgModule({
    imports: [NgrxActionsModule]
})
export class AppModule {
    constructor(store: Store<MyState>) {
        ngrxSelect(store);
    }
}
```

do this:

```javascript
import { NgrxActionsModule, NgrxSelect } from 'ngrx-actions';

@NgModule({
    imports: [NgrxActionsModule]
})
export class AppModule {
    constructor(ngrxSelect: NgrxSelect, store: Store<MyState>) {
        ngrxSelect.connect(store);
    }
}
```

# 1.2.0 - 1/3/17
- Feature: Select decorator

# 1.1.3 - 1/3/17
- Fix: Effects mismatch

# 1.1.2 - 1/3/17
- Fix: Effects with normal objects

# 1.1.1 - 1/3/17
- Fix: NPM publish issue

# 1.1.0 - 1/3/17
- Fix: Seralization
- Feature: Support multiple actions

# 1.0.0 - 1/2/17
- Initial Release
