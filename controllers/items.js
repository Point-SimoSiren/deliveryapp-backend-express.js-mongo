const itemsRouter = require('express').Router()
const Item = require('../models/item')
const jwt = require('jsonwebtoken')

itemsRouter.get('/', async (req, res) => {

    const items = await Item
        .find({}).populate('category', { name: 1 })
    console.log(items)
    res.json(items.map(item => item.toJSON()))
})


// GET ONE PRODUCT BY ID

itemsRouter.get('/:id', async (request, response, next) => {
    try {
        const item = await Item.findById(request.params.id)
        if (item) {
            response.json(item.toJSON())
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

// TOKEN PROCESSOR FUNCTION

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// ADMIN FEATURE: ADD NEW PRODUCT ITEM

itemsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    } catch (exception) {
        next(exception)
    }
    try {
        const newItem = new Item({
            name: body.name,
            package: body.package,
            price: body.price,
            active: body.active,
            manufacturer: body.manufacturer,
            description: body.description,
            category: body.categoryId
        })

        const savedItem = await newItem.save()
        response.json(savedItem.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = itemsRouter