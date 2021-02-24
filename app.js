const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const usersRouter = require('./controllers/users')
const itemsRouter = require('./controllers/items')
//const ordersRouter = require('./controllers/orders')
const categoriesRouter = require('./controllers/categories')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        logger.info('** ** ** Connected to MongoDB ** ** **')
    })
    .catch((error) => {
        logger.error('Error. Couldn´t connect MongoDB:', error.message)
    })


app.use(cors())
//app.use(express.static('build'))
app.use(helmet())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/items', itemsRouter)
app.use('/api/categories', categoriesRouter)
//app.use('/api/orders', ordersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app