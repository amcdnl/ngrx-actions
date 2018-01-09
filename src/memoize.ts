export function memoize(func) {
  const memo = {};
  const slice = Array.prototype.slice;
  return function() {
    const args = slice.call(arguments);
    if (args in memo) {
      return memo[args];
    } else {
      return (memo[args] = func.apply(this, args));
    }
  };
}
