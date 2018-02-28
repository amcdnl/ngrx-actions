# NGRX Actions

Actions/reducer utility for NGRX. It provides a handful of functions to make NGRX/Redux more Angular-tastic.

- `@Store(MyInitialState)`: Decorator for default state of a store.
- `@Action(...MyActionClass: Action[])`: Decorator for a action function.
- `@Effect(...MyActionClass: Action[])`: Decorator for a effect function.
- `ofAction(MyActionClass)`: Lettable operator for NGRX Effects
- `createReducer(MyStoreClass)`: Reducer bootstrap function
- `@Select('my.prop')`: Select decorator

Inspired by [redux-act](https://github.com/pauldijou/redux-act) and [redux-actions](https://github.com/reduxactions/redux-actions) for Redux.

See [changelog](CHANGELOG.md) for latest changes.

## Whats this for?
This is _sugar_ to help reduce boilerplate when using Redux patterns. That said, here's the high level of what it provides:

- Reducers become classes so its more logical organization
- Automatically creates new instances so you don't have to handle spreads everywhere
- Enables better type checking inside your actions
- Reduces having to pass type constants by using type checking

Its dead simple (<100LOC) and you can pick and choose where you want to use it.

## Getting Started
To get started, lets install the package thru npm:

```
npm i ngrx-actions --S
```

### Reducers
Next, create an action just like you do with NGRX today:

```javascript
export class MyAction {
  readonly type = 'My Action';
  constructor(public payload: MyObj) {}
}
```

then you create a class and decorate it with a `Store` decorator that contains
the initial state for your reducer. Within that class you define methods
decorated with the `Action` decorator with an argument of the action class
you want to match it on.

```javascript
import { Store, Action } from 'ngrx-actions';

@Store({
    collection: [],
    selections: [],
    loading: false
})
export class MyStore {
    @Action(Load, Refresh)
    load(state: MyState, action: Load) {
        state.loading = true;
    }

    @Action(LoadSuccess)
    loadSuccess(state: MyState, action: LoadSuccess) {
        state.collection = [...action.payload];
    }

    @Action(Selection)
    selection(state: MyState, action: Selection) {
        state.selections = [...action.payload];
    }

    @Action(DeleteSuccess)
    deleteSuccess(state: MyState, action: DeleteSuccess) {
        const idx = state.collection.findIndex(r => r.myId === action.payload);
        if (idx === -1) {
          return state;
        }
        const collection = [...state.collection];
        collection.splice(idx, 1);
        return { ...state, collection };
    }
}
```

You may notice, I don't return the state. Thats because if it doesn't see
a state returned from the action it inspects whether the state was an
object or array and automatically creates a new instance for you. If you are
mutating deeply nested properties, you still need to deal with those yourself.

You can still return the state yourself and it won't mess with it. This is helpful
for if the state didn't change or you have some complex logic going on. This can be
seen in the `deleteSuccess` action.

Above you may notice, the first action has multiple action classes. Thats because
the `@Action` decorator can accept single or multiple actions.

To hook it up to NGRX, all you have to do is call the `createReducer` function passing
your store. Now pass the `myReducer` just like you would a function with a switch statement inside.

```javascript
import { createReducer } from 'ngrx-actions';
export function myReducer(state, action) { return createReducer(MyStore)(state, action); }
```

In the above example, I return a function that returns my `createReducer`. This is because AoT
complains stating `Function expressions are not supported in decorators` if we just assign
the `createReducer` method directly. This is a known issue and [other NGRX](https://github.com/ngrx/platform/issues/116) things suffer from it too.

Next, pass that to your NGRX module just like normal:

```javascript
@NgModule({
   imports: [
      StoreModule.forRoot({
         pizza: pizzaReducer
      })
   ]
})
export class AppModule {}
```

Optionally you can also provide your store directly to the `NgrxActionsModule` and it will handle
creating the reducer for you and also enables the ability to use DI with your stores. So rather than
describing in `forRoot` or `forFeature` with `StoreModule`, we call them on `NgrxActionsModule`.

```javascript
@NgModule({
   imports: [
      NgrxActionsModule.forRoot({
         pizza: PizzaStore
      })
   ],
   providers: [PizzaStore]
})
export class AppModule {}
```

### Effects
If you want to use NGRX effects, I've created a lettable operator that will allow you to
pass the action class as the argument like this:

```javascript
import { ofAction } from 'ngrx-actions';

@Injectable()
export class MyEffects {
    constructor(
        private update$: Actions,
        private myService: MyService
    ) {}

    @Effect()
    Load$ = this.update$.pipe(
        ofAction(Load),
        switchMap(() => this.myService.getAll()),
        map(res => new LoadSuccess(res))
    );
}
```

In 3.x, we introduced a new decorator called `@Effect` that you can define in your store
to perform async operations.

```javascript
@Store({ delievered: false })
export class PizzaStore {
    constructor(private pizzaService: PizzaService) {}

    @Action(DeliverPizza)
    deliverPizza(state) {
        state.delivered = false;
    }

    @Effect(DeliverPizza)
    deliverPizzaToCustomer(state, { payload }: DeliverPizza) {
        this.pizzaService.deliver(payload);
    }
}
```

Effects are always run after actions.

### Selects
We didn't leave out selectors, there is a `Select` decorator that accepts a (deep) path string. This looks like:

```javascript
@Component({ ... })
export class MyComponent {
    // Functions
    @Select((state) => state.color) color$: Observable<string>;

    // Array of props
    @Select(['my', 'prop', 'color']) color$: Observable<strinv>;

    // Deeply nested properties
    @Select('my.prop.color') color$: Observable<string>;

    // Implied by the name of the member
    @Select() color: Observable<string>;

    // Remap the slice to a new object
    @Select(state => state.map(f => 'blue')) color$: Observable<string>;
}
```

This can help clean up your store selects. To hook it up, in the `AppModule` you do:

```javascript
import { NgrxActionsModule } from 'ngrx-actions';

@NgModule({
    imports: [NgrxActionsModule]
})
export class AppModule {}
```

And you can start using it in any component. It also works with feature stores too. Note: The Select decorator has a limitation of lack of type checking due to [TypeScript#4881](https://github.com/Microsoft/TypeScript/issues/4881).

## Common Questions
- _What about composition?_ Well since it creates a normal reducer function, you can still use all the same composition fns you already use.
- _Will this work with normal Redux?_ While its designed for Angular and NGRX it would work perfectly fine for normal Redux. If that gets requested, I'll be happy to add better support too.
- _Do I have to rewrite my entire app to use this?_ No, you can use this in combination with the tranditional switch statements or whatever you are currently doing.
- _Does it support AoT?_ Yes but see above example for details on implementation.
- _Does this work with NGRX Dev Tools?_ Yes, it does.
- _How does it work with testing?_ Everything should work the same way but don't forget if you use the selector tool to include that in your test runner though.

## Community
- [Reducing Boilerplate with NGRX-ACTIONS](https://medium.com/@amcdnl/reducing-the-boilerplate-with-ngrx-actions-8de42a190aac)
- [Adventures in Angular: NGRX Boilerplate](https://devchat.tv/adv-in-angular/aia-174-reducing-boilerplate-redux-ngrx-patterns-angular-austin-mcdaniel)
- [Introducing NGRX-Actions 3.0](https://medium.com/@amcdnl/introducing-ngrx-actions-3-0-557f6ce16678)
