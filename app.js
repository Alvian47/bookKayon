require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger 
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')


// parse req.body
app.use(express.json())

// use scurity
app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// middleware
const authenticationUser = require('./middleware/authentication')

// connectDB
const connectDB = require('./db/connection')

// routers
const authRouter = require('./routes/auth')
const booksRouter = require('./routes/books')

//routes
app.get('/', (req, res) => res.send('<h1>Books API</h1><a href="/api-docs">Documentation</a>'))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/books/', authenticationUser, booksRouter)

const port = process.env.PORT || 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server run on localhost:${port}`)
        })
    } catch(error){
        console.log(error)
    }
}

start()