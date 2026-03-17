import { Route as rootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as TodosRoute } from './routes/todos'
import { Route as PostsRoute } from './routes/posts'
import { Route as UsersRoute } from './routes/users'

const rootRouteWithContext = rootRoute

export const routeTree = rootRouteWithContext.addChildren([
  IndexRoute,
  TodosRoute,
  PostsRoute,
  UsersRoute,
])
