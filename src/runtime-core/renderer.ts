import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

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
    mountChildren(n2.children, container, parentComponent);
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent) {
    const { shapeFlags: prevShapeFlags, children: c1 } = n1;
    const { shapeFlags, children: c2 } = n2;

    // 新的是text
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        // 移除老的children
        unMountChildren(c1);
      }
      // 添加新的text
      if (c1 !== c2) {
        hostSetElementText(c2, container);
      }
    } else {
      // 新的是array
      if (prevShapeFlags & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText("", container);
        mountChildren(c2, container, parentComponent);
      }
    }
  }

  function unMountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
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

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2;
    let textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function mountElement(vnode, container, parentComponent) {
    const { type, children, shapeFlags } = vnode;
    let el = (vnode.el = hostCreateElement(type));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent);
    }

    const { props } = vnode;
    for (const key in props) {
      const value = props[key];
      hostPatchProp(el, key, null, value);
    }

    hostInsert(el, container);
  }

  function mountChildren(children, el, parentComponent) {
    children.forEach((n2) => {
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
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
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
