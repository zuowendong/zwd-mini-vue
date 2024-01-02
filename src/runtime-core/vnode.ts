import { ShapeFlags } from "../shared/shapeFlags";

export const Fragment = Symbol("Fragment");

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlags: getShapeFlags(type),
    el: null,
  };

  if (typeof children === "string") {
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
  }

  if (vnode.shapeFlags && ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.SLOTS_CHILDREN;
    }
  }

  return vnode;
}

function getShapeFlags(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
