import { Todo } from "./todo";

const app = { Todo };

// factory pattern
// https://www.digitalocean.com/community/tutorials/js-factory-pattern
export function createFactoryApp(type, attr) {
  const AppType = app[type];
  return new AppType(attr);
}
