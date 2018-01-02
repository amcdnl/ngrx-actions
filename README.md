# NGRX Actions

Actions/reducer utility for NGRX. It provides 3 functions to make NGRX/redux more Angular-tastic.

- `@Store(MyInitialState)`: Decorator for default state of a store.
- `@Action(MyActionClass)`: Decorator for a action function.
- `ofAction(MyActionClass)`: Lettable operator for NGRX Effects
- `createReducer(MyStoreClass)`: Reducer bootstrap function

## Getting Started
To get started, you define an action just like you do today for NGRX:

```javascript
export class MyAction implements Action {
   readonly type = 'My Action';
   constructor(public payload: MyObj) {}
}
```

then you create a class a decorate it with a `Store` decorator that contains
the initial state for your reducer. Within that class you define methods
decorated with the `Action` decorator with an argument of the action class
you want to match it on.

```javascript
@Store({
    collection: [],
    selections: [],
    loading: false
})
export class MyStore {
    @Action(Load)
    load(state: MyState, action: Load) {
        state.loading = true;
    }

    @Action(LoadSuccess)
    loadSuccess(state: MyState, action: LoadSuccess) {
        state.collection = [...action.payload];
    }

    @Action(Selection)
    selection(state: MyState, action: Selection) {
        state.collection = [...action.payload];
    }

    @Action(DeleteSuccess)
    deleteSuccess(state: MyState, action: DeleteSuccess) {
        const idx = state.collection.findIndex(r => r.myId === action.payload);
        const collection = [...state.collection];
        collection.splice(idx, 1);
        state.collection = collection;
    }
}
```

You may notice, I don't return the state. Thats because if it doesn't see
a state returned from the action it inspects whether the state was an
object or array and automatically creates a new instance for you. If you are
mutating deeply nested properties, you still need to deal with those yourself.

To hook it up to NGRX, all you have to do is call `createReducer` function passing
your store. Now pass the `myReducer` just like you would a function with a switch statement inside.

```javascript
export const myReducer = createReducer(MyStore);
```

If you want to use NGRX effects, I've created a lettable operator that will allow you to
pass the action class as the argument like this:

```javascript
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
