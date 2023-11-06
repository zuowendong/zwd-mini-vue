class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    reactiveEffect = this;
    this._fn();
  }
}

let targetMap = new Map();
export function track(target, key) {
  // target -> key -> dep
  let depMap = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }
  let dep = depMap.get(key);
  if (!dep) {
    dep = new Set();
    depMap.set(key, dep);
  }
  dep.add(reactiveEffect);
}

export function trigger(target, key) {
  let depMap = targetMap.get(target);
  let dep = depMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}

let reactiveEffect;
export function effect(fn) {
  let _effect = new ReactiveEffect(fn);
  _effect.run();
}
