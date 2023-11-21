const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return Reflect.get(setupState, key);
    }

    const proxyGetter = publicPropertiesMap[key];
    if (proxyGetter) {
      return proxyGetter(instance);
    }
  },
};
