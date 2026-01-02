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

router.get('/api/files-backup', async (ctx) => {
    try {
        const clientsData = await fs.readFile(clientsFile, 'utf-8')
        const kanbanData = await fs.readFile(kanbanFile, 'utf-8')

        ctx.body = {
            clients: JSON.parse(clientsData),
            kanban: JSON.parse(kanbanData)
        }
        ctx.status = 200
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to create backup' }
    }
    
})

router.post('/api/new-client', async (ctx) => {
    try {
        const newClient = ctx.request.body
        const data = await fs.readFile(clientsFile, 'utf-8')
        const clients = JSON.parse(data)

        // get the last id and increment
        const lastId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) : 0
        newClient.id = lastId + 1

        clients.push(newClient)
        await fs.writeFile(clientsFile, JSON.stringify(clients, null, 2))
        ctx.status = 201
        ctx.body = newClient
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to add new client' }
    }
})

router.put('/api/modify-client/:id', async (ctx) => {
    try {
        const { id } = ctx.params
        const updatedClient = ctx.request.body

        const data = await fs.readFile(clientsFile, 'utf-8')
        let clients = JSON.parse(data)

        clients = clients.map(client => {
            if (client.id === Number(id)) {
                return {
                    ...client,
                    ...updatedClient
                }
            }
            return client
        })

        await fs.writeFile(clientsFile, JSON.stringify(clients, null, 2))
        ctx.status = 200
        ctx.body = updatedClient
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to modify client' }
    }
})

router.delete('/api/delete-client/:id', async (ctx) => {
    try {
        const { id } = ctx.params
        const data = await fs.readFile(clientsFile, 'utf-8')
        let clients = JSON.parse(data)

        clients = clients.filter(client => {
            return client.id !== Number(id)
        })
        await fs.writeFile(clientsFile, JSON.stringify(clients, null, 2))

        ctx.status = 200
        ctx.body = { message: 'Client deleted successfully' }
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to delete client' }
    }
})

router.post('/api/new-task', async (ctx) => {
    try {
        const { id } = ctx.request.body

        const clientsDataFile = await fs.readFile(clientsFile, 'utf-8')
        const clientsData = JSON.parse(clientsDataFile)

        const clientData = clientsData.filter(client => {
            return client.id == Number(id)
        })

        const kanbanDataFile = await fs.readFile(kanbanFile, 'utf-8')
        const kanbansData = JSON.parse(kanbanDataFile)

       const newTask = {
            id: clientData[0].id,
            name: clientData[0].name,
            product: clientData[0].product,
            email: clientData[0].email,
            phone: clientData[0].phone,
            msgCount: 0,
            // format the Date only with DD/MM/YYYY
            since: new Date().toLocaleDateString('en-GB'),
            lastContact: new Date().toLocaleDateString('en-GB')
        }

        kanbansData[0]?.tasks.push(newTask)

        await fs.writeFile(kanbanFile, JSON.stringify(kanbansData, null, 2))
        ctx.status = 201
        ctx.body = newTask

    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to add new task' }
    }
})

router.put('/api/update-task-position/:id/:position', async (ctx) => {
    try {
        const { id, position } = ctx.params

        const kanbanDataFile = await fs.readFile(kanbanFile, 'utf-8')
        let kanbansData = JSON.parse(kanbanDataFile)
        let movedTask = null

        kanbansData = kanbansData.map(kanban => {
            return {
                ...kanban,
                tasks: kanban.tasks.map(task => {

                    // remove the task from OLD position
                    if (task.id === Number(id)) {
                        movedTask = task
                        return null
                    }

                    return task
                }).filter(task => task !== null) // remove nulls
            }
        })

        // add the task to NEW position
        kanbansData = kanbansData.map(kanban => {

            if (kanban.taskId === Number(position)) {
                kanban.tasks.push(movedTask)
            }

            return {
                ...kanban,
                tasks: kanban.tasks.concat([]) // clone array
            }
        })

        await fs.writeFile(kanbanFile, JSON.stringify(kanbansData, null, 2))

        ctx.status = 200
        ctx.body = { message: 'Task updated successfully' }
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to update task' }
    }
})

router.post('/api/update-task-details/:id', async (ctx) => {
    try {
        const { id } = ctx.params
        const updatedDetails = ctx.request.body

        const kanbanDataFile = await fs.readFile(kanbanFile, 'utf-8')
        let kanbansData = JSON.parse(kanbanDataFile)

        kanbansData = kanbansData.map(kanban => {
            return {
                ...kanban,
                tasks: kanban.tasks.map(task => {
                    if (task.id === Number(id)) {
                        return {
                            ...task,
                            ...updatedDetails
                        }
                    }
                    return task
                })
            }
        })

        await fs.writeFile(kanbanFile, JSON.stringify(kanbansData, null, 2))

        ctx.status = 200
        ctx.body = { message: 'Task details updated successfully' }
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to update task details' }
    }
})

router.delete('/api/delete-task/:id', async (ctx) => {
    try {
        const { id } = ctx.params
        const kanbanDataFile = await fs.readFile(kanbanFile, 'utf-8')
        let kanbansData = JSON.parse(kanbanDataFile)

        kanbansData = kanbansData.map(kanban => {

            // @DEBUG
            // const t = kanban.tasks.filter(task => task.id !== Number(id))
            // console.log('@TASKS after delete:', t)

            return {
                ...kanban,
                tasks: kanban.tasks.filter(task => task.id !== Number(id))
            }
        })

        await fs.writeFile(kanbanFile, JSON.stringify(kanbansData, null, 2))

        ctx.status = 200
        ctx.body = { message: 'Task deleted successfully' }
    } catch (error) {
        ctx.status = 500
        ctx.body = { error: 'Failed to delete task' }
    }
})

app.use(router.routes()).use(router.allowedMethods())


const server = app.listen(SERVER_PORT, () => {
    console.log(`@SERVER >> ${server.address().address} ${SERVER_PORT}`)
})