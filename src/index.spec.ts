import { Store, createReducer, Action } from './index';

describe('actions', () => {
  it('adds defaults', () => {
    class MyAction {
      readonly type = 'myaction'
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
    class MyAction {}

    @Store({ foo: true })
    class Bar {}

    const reducer = createReducer(Bar);
    const res = reducer(undefined, new MyAction());
    expect(res.foo).toBe(true);
  });

  it('finds correct action', () => {
    class MyAction {
      readonly type = 'myaction'
    }

    @Store({ foo: true })
    class Bar {
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
      readonly type = 'myaction'
    }

    class MyAction2 {
      readonly type = 'myaction2'
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
});
