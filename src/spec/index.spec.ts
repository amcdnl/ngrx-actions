import { Store, createReducer, Action, ofAction, Select, NgrxSelect } from '../index';
import { Action as NgRxAction, createFeatureSelector, createSelector, Store as NgRxStore } from '@ngrx/store';
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

    const reducer = createReducer<FooState | undefined>(Bar);
    const res = reducer(undefined, new MyAction());
    expect(res && res.foo).toBe(true);
  });

  it('createReducer works with instance', () => {
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

    const reducer = createReducer(new Bar());
    const res = reducer(undefined, new MyAction());
    expect(res && res.foo).toBe(true);
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

  it('throws when defining multiple reducer for one action', () => {
    class MyAction {
      readonly type = '[my] myaction';
    }

    expect(() => {
      @Store({ foo: true })
      class Bar {
        @Action(MyAction)
        foo(state) {
          state.foo = false;
        }

        @Action(MyAction)
        bar(state) {
          state.foo = true;
        }
      }

      createReducer(Bar);
    }).toThrowError(`@Action for '[my] myaction' is defined multiple times in functions 'foo' and 'bar'`);
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

    class MyAction3 implements NgRxAction {
      readonly type = 'myaction3';
      constructor(public foo: any, public bar: any) {}
    }

    const action = new MyAction('foo');
    const action2 = new MyAction2();
    const action3 = new MyAction3('a', 0);
    const actions = of<NgRxAction>(action, action2, action3);
    const tappedActions: NgRxAction[] = [];
    actions.pipe(ofAction<MyAction | MyAction2>(MyAction, MyAction2)).subscribe(a => {
      tappedActions.push(a);
    });

    expect(tappedActions.length).toEqual(2);
    expect(tappedActions[0]).toBe(action);
    expect(tappedActions[1]).toBe(action2);
  });

  it('selects sub state', () => {
    const globalState: {
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
      @Select(state => [])
      bar2$: Observable<any[]>; // Remapping to different obj
    }

    const store = new NgRxStore(of(globalState), undefined, undefined);

    try {
      NgrxSelect.store = store;

      const mss = new MyStateSelector();

      mss.hello$.subscribe(n => {
        expect(n).toBe('world');
      });

      mss.myFeature.subscribe(n => {
        expect(n).toBe(globalState.myFeature);
      });

      mss.bar2$.subscribe(n => {
        expect(n.length).toBe(0);
      });

      mss.bar$.subscribe(n => {
        expect(n).toBe(globalState.myFeature.bar);
      });
    } finally {
      NgrxSelect.store = undefined;
    }
  });
});
