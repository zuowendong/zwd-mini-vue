import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

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
