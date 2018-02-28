# 3.1.6 - 2/27/18
- Fix: Effects materialize vs take

# 3.1.5 - 2/27/18
- Fix: Effects not unsubscribing

# 3.1.4 - 2/27/18
- Feature: Effects can return array objects

# 3.1.3 - 2/27/18
- Feature: Effects can return plain objects and dispatch

# 3.1.2 - 2/27/18
- Feature: Effects dispatch and subscribe if you return them in effects

# 3.1.1 - 2/27/18
- Feature: Handle non-resolved providers with new klass

# 3.1.0 - 2/26/18
- Feature: Seperate Actions from Effects.

# 3.0.2 - 2/26/18
- Fix: Aot error with forFeature method

# 3.0.1 - 2/26/18
- Fix: Tokens undefined when not providing `forRoot`

# 3.0.0 - 2/26/18
- Feature: Added ability to use DI with Stores

Example:
```
@NgModule({
    imports: [
        NgrxActionsModule.forRoot({ pizza: MyStore })
    ]
    providers: [MyStore]
})
```

# 2.4.2 - 2/14/18
- Per: Improve `Select` perf by caching get
- Revert: Revert `prototype.name` attempts since ngrx won't support it

# 2.4.1 - 2/14/18
- Bug: Revert 2.4.0 Select perf due to critical bugs w/ caching

# 2.4.0 - 2/13/18
- Refactor: Get rid of `SelectMap` and consolidate to `Select`
- Perf: Improve `Select` perf by caching GET

# 2.3.0 - 2/11/18
- Feature: `SelectMap` decorator

# 2.1.3 - 2/9/18
- Feature: Reduce boilerplate for select connect

# 2.1.2 - 1/25/18
- Chore: Bump peer deps for ngrx 5
- Fix: Throws when defining multiple reducer for one action

# 2.1.1 - 1/18/18
- Fix: Remove need for reflect-metadata causing issues #18

# 2.1.0 - 1/14/18
- Feature: Add support for memoized selectors in `@Select` decorator
- Feature: add support for `@Select('a', 'b', 'c')` in `@Select` decorator
- Fix: Performance improvement on `@Select('a.b.a)` #14

# 2.0.7 - 1/10/18
- Fix: Fix publish

# 2.0.6 - 1/10/18
- Fix: Type issue #13

# 2.0.5 - 1/9/18
- Fix: Performance Improvements #10

# 2.0.4 - 1/7/18
- Feature: Memoize Select

# 2.0.3 - 1/7/18
- Fix: Build tweaks

# 2.0.2 - 1/7/18
- Chore: Add error handling for select connect

# 2.0.1 - 1/7/18
- Chore: Better builds

# 2.0.0 - 1/5/18
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

# 1.2.0 - 1/3/18
- Feature: Select decorator

# 1.1.3 - 1/3/18
- Fix: Effects mismatch

# 1.1.2 - 1/3/18
- Fix: Effects with normal objects

# 1.1.1 - 1/3/18
- Fix: NPM publish issue

# 1.1.0 - 1/3/18
- Fix: Seralization
- Feature: Support multiple actions

# 1.0.0 - 1/2/18
- Initial Release
