import { Store, createReducer, Action, ofAction } from './index';
import { of } from 'rxjs/Observable/of';
import { Action as NgRxAction } from '@ngrx/store';

describe('actions', () => {
  interface FooState {
    foo: boolean | null;
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
});
