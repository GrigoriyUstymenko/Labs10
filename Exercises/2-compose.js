'use strict';

const compose = (...fns) => {
  const handlers = {};
  const composed = x => {
    let res = x;
    for (const f of fns.reverse()) {
      try {
        res = f(res);
      } catch (err) {
        composed.emit('error', err);
        return undefined;
      }
    }
    return res;
  };
  composed.on = (name, callback) => {
    handlers[name] = handlers[name] || [];
    handlers[name].push(callback);
  };
  composed.emit = (name, ...args) => {
    for (const fn of handlers[name]) {
      fn(...args);
    }
  };
  return composed;
};

module.exports = { compose };
