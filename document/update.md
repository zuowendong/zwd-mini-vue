# 元素element 更新

## 更新element流程搭建

新建测试项目 update，App.js 代码如下：

```js
import { h, ref } from "../../lib/zwd-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    let count = ref(0);
    const onClick = () => {
      count.value++;
    };
    return {
      count,
      onClick,
    };
  },
  render() {
    return h("div", {}, [
      h("div", {}, `count: ${this.count}`),
      h(
        "button",
        {
          onClick: this.onClick,
        },
        "click"
      ),
    ]);
  },
};
```

上面代码中，渲染了两个组件，`count`组件中从`setup`获取`count`的响应值，按钮组件有一个点击事件，点击会触发`count`变量自增。

这里引用了`ref`方法，首先解决的就是`ref`方法的导出。

### 导出ref

reactivity 下新建 index.ts 用于文件导出的接口。

```ts
export { ref } from "./ref";
```

再在根目录下的 index.ts 导出 reactivity

```ts
export * from "./runtime-dom/index";
export * from "./reactivity";
```

实时编译执行`yarn build --watch`， 在浏览器中查看效果，

![](./static/update-1.png)

发现`count`显示的是`ref`对象，期待的是在渲染中使用`ref`对象是可以直接获取其`value`值。

在 ref.ts 中`proxyRefs`方法用于自动解析`ref`对象，可以直接获取`.value`的数据。

在 index.ts 中导出`proxyRefs`方法，

```ts
export { ref, proxyRefs } from "./ref";
```

渲染时获取到`setup`返回值的处理逻辑是在 component.ts 下的`handleSetupResult`方法里，对`setup`返回值`setupResult`处理即可，

```ts
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
```

在浏览器中查看效果，`count`值如期显示。

### 流程改造

在渲染中访问`count`变量，会触发它的`get`操作，进行依赖收集，在点击操作时候更新`count`值，就需要触发依赖。

在 render.ts 中 `setupRenderEffect`方法，生成虚拟节点树进行`patch`逻辑处理转换成真实节点挂载到容器里。此时更新渲染中用到的响应式数据，只需要将原有逻辑用`effect`包裹，就可以再次触发依赖执行。

这里回顾一下`effect`。`effect`直接翻译为作用，意思是使其发生作用，这个使其的其就是我们传入的函数，所以`effect`的作用就是让我们传入的函数发生作用，也就是执行这个函数。

```ts
function setupRenderEffect(instance, initialVnode, container) {
  effect(() => {
    const { proxy } = instance;
    const subTree = (instance.subTree = instance.render.call(proxy));
    patch(subTree, container, instance);
    initialVnode.el = subTree.el;
  });
}
```

当初次执行，生成的虚拟节点转换成真实节点会挂载到容器里，如果更新之后再次触发，就会再次生成新的虚拟节点转换成真实节点并再次挂载到容器里，会出现如下这样的情况：

![](./static/update-2.gif)

这明显是不对的，更新操作是需要定位到需要更新的数据节点处进行替换，也就是这儿例子中的`count`所在`div`，当点击一次之后，只需要将原本的`count: 0`转变成`count: 1`即可，`button`这样的其他的元素保持不动。

在组件实例对象`instance`上定义一个布尔值变量`isMounted`，用来判断初始化阶段还是更新阶段。在更新操作阶段，会存在两份新老虚拟节点，老的虚拟节点树的数据可以在初始化时候保存一份在`instance`中，方便更新阶段获取。

```ts
function setupRenderEffect(instance, initialVnode, container) {
  effect(() => {
    if (!instance.isMounted) {
      console.log("init");
      const { proxy } = instance;
      const subTree = (instance.subTree = instance.render.call(proxy));
      patch(null, subTree, container, instance);
      initialVnode.el = subTree.el;
      instance.isMounted = true;
    } else {
      console.log("update");
      const { proxy } = instance;
      const subTree = instance.render.call(proxy);
      const prevSubTree = instance.subTree;
      patch(prevSubTree, subTree, container, instance);
    }
  });
}
```

上面代码可以看出，`patch`方法接收了新老两份虚拟节点树，那整体涉及到`patch`的方法都需要修改一下参数，完整代码如下：

```ts
export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;

  function render(n2, container) {
    patch(null, n2, container, null);
  }

  // n1: 老的
  // n2: 新的
  function patch(n1, n2, container, parentComponent) {
    const { type, shapeFlags } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }

        break;
    }
  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    console.log("patchElement");

    console.log("n1", n1);
    console.log("n2", n2);
  }

  function processText(n1, n2, container) {
    const { children } = n2;
    let textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function mountElement(vnode, container, parentComponent) {
    const { type, children, shapeFlags } = vnode;
    let el = (vnode.el = createElement(type));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    const { props } = vnode;
    for (const key in props) {
      const value = props[key];
      patchProp(el, key, value);
    }

    insert(el, container);
  }

  function mountChildren(vnode, el, parentComponent) {
    vnode.children.forEach((n2) => {
      patch(null, n2, el, parentComponent);
    });
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }

  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
```

其中，还需要修改的是`patchElement`方法，因为更新的是`element`，那关注点也是放在`element`处理逻辑上，也就是`processElement`方法里。当没有`n1`参数时，就说明此时是初始化操作阶段，还是走原有逻辑挂载`element`，否则就是更新逻辑。`patchElement`方法中就需要处理对比更新的逻辑。

组件实例上新定义的`isMounted`和`subTree`，初始化时都要提前定义好，

```ts
export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {},
  };
  component.emit = emit.bind(null, vnode) as any;
  return component;
}
```

在浏览器中，验证结果：

![](./static/update-3.png)

## 更新props

修改测试项目 update，App.js 代码如下：

```js
import { h, ref } from "../../lib/zwd-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    let count = ref(0);
    const onClick = () => {
      count.value++;
    };

    let obj = ref({
      foo: "foo",
      bar: "bar",
    });
    const changeObj1 = () => {
      obj.value.foo = "new-foo";
    };
    const changeObj2 = () => {
      obj.value.foo = undefined;
    };
    const changeObj3 = () => {
      obj.value = {
        foo: "foo",
      };
    };

    return {
      count,
      onClick,

      obj,
      changeObj1,
      changeObj2,
      changeObj3,
    };
  },
  render() {
    return h("div", { ...this.obj }, [
      h("div", {}, `count: ${this.count}`),
      h("button", { onClick: this.onClick }, "click"),
      h("button", { onClick: this.changeObj1 }, "修改foo"),
      h("button", { onClick: this.changeObj2 }, "foo为undefined"),
      h("button", { onClick: this.changeObj3 }, "没有bar"),
    ]);
  },
};
```

以上代码，新增了 3 个按钮，用于验证 `props` 更新的 3 个场景，分别是：

1. 修改响应式对象`obj`中`foo`的值，预期在`props`中`foo`的值修改
2. 设置`foo`为`undefined`或`null`，预期`props`中移除`foo`
3. 设置`obj`对象，不存在`bar`，预期`props`中移除`bar`

将`obj`对象绑定在最外层`div`的属性中，便于验证。

页面效果如下：

![](./static/update-4.png)

### 修改foo

更新`props`，则需要新老两份`props`，

```ts
function patchElement(n1, n2, container) {
  const oldProps = n1.props || {};
  const newProps = n2.props || {};
  patchProps(oldProps, newProps);
}
patchProps方法中，对比新老props。修改foo为新的值，则遍历新的props,
function patchProps(el, oldProps, newProps) {
  if (oldProps !== newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];

      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp);
      }
    }
}
```

以上代码，新老`props`不同时才需要对比。遍历新的`props`中，找到每一项新老的`prop`，也只有新老的`prop`不同时才需要更新，这里更新的操作调用原本封装好的`hostPatchProp`方法，但是该方法接收的参数中需要一个`el`，又少一个`prevProp`参数。

**改造`patchProp`**，`el`的来源，在`n1`上存在`el`，但是在更新之后，现在的`n2`就会变成`n1`，可是`n2`上并没有`el`，就需要在此时把 `n1`上的`el`提前保存一份到`n2`上，这样就保证了`el`数据传递下去。

```ts
function patchElement(n1, n2, container) {
  const oldProps = n1.props || {};
  const newProps = n2.props || {};
  const el = (n2.el = n1.el);
  patchProps(el, oldProps, newProps);
}

function patchProps(el, oldProps, newProps) {
  if (oldProps !== newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp);
      }
    }
  }
}
```

`hostPatchProp`方法，也就是`patchProp`，添加`prevProp`的参数，

```ts
function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
      el.setAttribute(key, nextVal);
  }  
}
```

在回到 renderer.ts 中，`hostPatchProp`方法还有一个地方调用了，在`mountElement`方法中，此时未初始化不存在老的`props`，`hostPatchProp`中`prevProp`设为`null`。

浏览器中验证，页面效果如下：

![](./static/update-5.gif)

### foo为undefined/null即移除

属性的移除操作使用`removeAttribute`，

```ts
function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal) {
      el.setAttribute(key, nextVal);
    } else {
      el.removeAttribute(key, nextVal);
    }
  }
}
```

浏览器中验证，页面效果如下：

![](./static/update-6.gif)

### 没有bar即移除

循环老的`props`，循环项如果是在新的`props`中不存在的话，就将新的`prop`设为`null`，

```ts
function patchProps(el, oldProps, newProps) {
  if (oldProps !== newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];

      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp);
      }
    }

    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  }
}
```

浏览器中验证，页面效果如下：

![](./static/update-7.gif)

## 更新children

更新children的情况更复杂，有涉及到diff算法，单独开一篇。
详见下一篇。

## 总结

实现页面中元素绑定的响应式数据的更新变化，意味着在响应式数据发生改变的时候，再次触发`render`函数的执行，使用`effect`实现依赖收集，其内部包裹的匿名函数，也就是`setupRenderEffect`原有的执行逻辑代码。

当调用`render`函数的时候，会触发函数内部用到的响应式数据，触发依赖收集，收集`effect`内部的匿名函数，在响应式数据修改时候触发所有依赖，也就是触发了匿名函数进行重新调用，也就是执行了`render`函数，返回全新的虚拟节点树。这就是新老两份虚拟节点树生成了。

更新元素`props`，针对3个场景进行分类实现。`props`数据修改，循环老的虚拟节点树找到和新的虚拟节点树中不一样的进行更新；`props`数据存在`undefined`或`null`，删除属性`removeAttribute`；设置新的`props`响应式数据，循环新的虚拟节点树查找不存在于老的虚拟节点树中的一项进行移除。
