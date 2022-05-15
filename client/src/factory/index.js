import { Todo } from "./todo";
import { User } from "./user";
import { Room } from "./room";
import { Message } from "./message";

const app = { Todo, User, Room, Message };

// factory pattern
// https://www.digitalocean.com/community/tutorials/js-factory-pattern
export function createFactoryApp(type, attr) {
  const AppType = app[type];
  return new AppType(attr);
}
