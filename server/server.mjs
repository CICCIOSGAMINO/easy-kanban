import Koa from 'koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import serve from 'koa-static'
import fs from 'fs/promises'


const SERVER_PORT = 3000
const app = new Koa()
const router = new Router()

// Enable CORS
app.use(cors())

// Middleware to parse request bodies
app.use(koaBody({ json: true, multipart: true }))

// Ensure data directory exists
const dataDir = new URL('../data/', import.meta.url)
try {
    await fs.access(dataDir)
} catch {
    await fs.mkdir(dataDir, { recursive: true })
}

// ---------------------------- Logger Middleware -----------------------------
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} (${ms}ms)`)
})

// ------------------------------ Static Files --------------------------------
app.use(serve(new URL('../dist/', import.meta.url).pathname), {
    maxAge: 864e5, // 1 day
    gzip: true,
    brotli: true,
    setHeaders: (res) => {
        // res.setHeader('Cache-Control', 'public, max-age=86400') // 1 day
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    }

})

const clientsFile = new URL('../data/clients.json', import.meta.url)
const kanbanFile = new URL('../data/kanban.json', import.meta.url)

// ------------------------------ Routes --------------------------------------
router.get('/api/clients', async (ctx) => {
    try {
        const data = await fs.readFile(clientsFile, 'utf-8')
        ctx.body = JSON.parse(data)
        ctx.status = 200
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to read clients data' }
    }
    
})

router.get('/api/kanban', async (ctx) => {
    try {
        const data = await fs.readFile(kanbanFile, 'utf-8')
        ctx.body = JSON.parse(data)
        ctx.status = 200
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to read kanban data' }
    }
    
})

router.post('/api/new-client', async (ctx) => {
    try {
        const newClient = ctx.request.body
        const data = await fs.readFile(clientsFile, 'utf-8')
        const clients = JSON.parse(data)
        clients.push(newClient)
        await fs.writeFile(clientsFile, JSON.stringify(clients, null, 2))
        ctx.status = 201
        ctx.body = newClient
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to add new client' }
    }
})

app.use(router.routes()).use(router.allowedMethods())


const server = app.listen(SERVER_PORT, () => {
    console.log(`@SERVER >> ${server.address().address} ${SERVER_PORT}`)
})