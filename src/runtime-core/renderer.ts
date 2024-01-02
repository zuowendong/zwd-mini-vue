import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  const { type, shapeFlags } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;

    default:
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }

      break;
  }
}

function processFragment(vnode, container) {
  mountChildren(vnode, container);
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  const { type, children, shapeFlags } = vnode;
  let el = (vnode.el = document.createElement(type));

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }

  const { props } = vnode;
  for (const key in props) {
    const value = props[key];
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);
    } else {
      el.setAttribute(key, value);
    }
  }

  container.append(el);
}

function mountChildren(vnode, el) {
  vnode.children.forEach((v) => {
    patch(v, el);
  });
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  initialVnode.el = subTree.el;
}
