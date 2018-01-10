import { Store, createReducer, Action, ofAction, Select, NgrxSelect } from './index';
import { Action as NgRxAction, Store as NgRxStore, createFeatureSelector, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

describe('actions', () => {
  interface FooState {
    foo: boolean | null;
    bar?: {
      a?: {
        b?: any;
      };
    };
  }

  it('has strict type checking working', () => {
    class MyAction {
      readonly type = 'myaction';
    }

    @Store<FooState>({ foo: true })
    class Bar {
      @Action(MyAction)
      foo(state: FooState, action: MyAction) {
        return state;
      }
    }

    const reducer = createReducer<FooState>(Bar);
    const res = reducer(undefined, new MyAction());
    expect(res.foo).toBe(true);
  });

  it('adds defaults', () => {
    class MyAction {
      readonly type = 'myaction';
    }

    @Store({ foo: true })
    class Bar {
      @Action(MyAction)
      foo() {}
    }

    const reducer = createReducer(Bar);
    const res = reducer(undefined, new MyAction());
    expect(res.foo).toBe(true);
  });

  it('works without actions', () => {
    class MyAction {
      type: 'NoAction';
    }

    @Store({ foo: true })
    class Bar {}

    const reducer = createReducer(Bar);
    const res = reducer(undefined, new MyAction());
    expect(res.foo).toBe(true);
  });

  it('finds correct action', () => {
    class MyAction {
      readonly type = 'myaction';
    }

    class MyAction2 {
      readonly type = 'myaction2';
    }

    @Store({ foo: true })
    class Bar {
      @Action(MyAction2)
      bar(state) {
        state.foo = null;
      }

      @Action(MyAction)
      foo(state) {
        state.foo = false;
      }
    }

    const reducer = createReducer(Bar);
    const res = reducer(undefined, new MyAction());
    expect(res.foo).toBe(false);
  });

  it('supports multiple actions', () => {
    class MyAction {
      readonly type = 'myaction';
    }

    class MyAction2 {
      readonly type = 'myaction2';
    }

    @Store({ foo: true })
    class Bar {
      @Action(MyAction, MyAction2)
      foo(state) {
        state.foo = false;
      }
    }

    const reducer = createReducer(Bar);
    const res = reducer(undefined, new MyAction2());
    expect(res.foo).toBe(false);
  });

  it('works with plain objects', () => {
    class MyAction {
      readonly type = 'myaction';
    }

    @Store({ foo: true })
    class Bar {
      @Action(MyAction)
      foo(state) {
        state.foo = false;
      }
    }

    const reducer = createReducer(Bar);
    const res = reducer(undefined, { type: 'myaction' });
    expect(res.foo).toBe(false);
  });

  it('filters actions', () => {
    class MyAction implements NgRxAction {
      readonly type = 'myaction';
      constructor(public payload: any) {}
    }

    class MyAction2 implements NgRxAction {
      readonly type = 'myaction2';
    }

    const action = new MyAction('foo');
    const actions = of<NgRxAction>(action, new MyAction2());
    let tappedAction: NgRxAction;
    actions.pipe(ofAction(MyAction)).subscribe(a => {
      tappedAction = a;
    });

    expect(tappedAction).toBe(action);
  });

  it('selects sub state', () => {
    const state: {
      myFeature: FooState;
    } = {
      myFeature: {
        foo: true,
        bar: {
          a: {
            b: {
              c: {
                d: 'world'
              }
            }
          }
        }
      }
    };

    const msFeature = createFeatureSelector<FooState>('myFeature');
    const msBar = createSelector(msFeature, state => state.bar);

    class MyStateSelector {
      @Select('myFeature.bar.a.b.c.d') hello$: Observable<string>; // deeply nested props
      @Select() myFeature: Observable<FooState>; // implied by name
      @Select(msBar) bar$: Observable<any>; // using MemoizedSelector
    }

    const store = new NgRxStore(of(state), undefined, undefined);

    try {
      NgrxSelect.store = store;

      const mss = new MyStateSelector();

      mss.hello$.subscribe(n => {
        expect(n).toBe('world');
      });

      mss.myFeature.subscribe(n => {
        expect(n).toBe(state.myFeature);
      });

      mss.bar$.subscribe(n => {
        expect(n).toBe(state.myFeature.bar);
      });
    } finally {
      NgrxSelect.store = undefined;
    }
  });
});
