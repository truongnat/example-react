// db-server.js — starts json-server on port 3001
import jsonServer from 'json-server'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = jsonServer.create()
const dbRouter = jsonServer.router(join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults({
  cors: true,
  readOnly: false,
})

app.use(middlewares)
app.use(jsonServer.bodyParser)
app.use(dbRouter)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅ JSON Server is running on http://localhost:${PORT}`)
  console.log(`📋 Todos API:  http://localhost:${PORT}/todos`)
})
