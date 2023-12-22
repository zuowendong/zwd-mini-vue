import { camelCase, toHandlerKey } from "../shared/index";

export function emit(instance, event) {
  const { props } = instance;

  const handlerName = toHandlerKey(camelCase(event));
  const handler = props[handlerName];
  handler && handler();
}
