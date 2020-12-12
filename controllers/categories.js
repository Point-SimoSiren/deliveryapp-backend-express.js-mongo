const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const jwt = require('jsonwebtoken')

// GET ALL PRODUCT CATEGORIES

categoriesRouter.get('/', async (request, response) => {
    const categories = await Category
        .find({})

    response.json(categories.map(category => category.toJSON()))
});

categoriesRouter.get('/:id', async (request, response, next) => {
    try {
        const category = await Category.findById(request.params.id)
        if (category) {
            response.json(category.toJSON())
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

// ADMIN FEATURE: POST NEW PRODUCT CATEGORY

categoriesRouter.post('/', async (request, response, next) => {
    const body = request.body

    const token = getTokenFrom(request)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const newCategory = new Category({
            name: body.name,
            description: body.description
        })

        const savedCategory = await newCategory.save()
        response.json(savedCategory.toJSON())
    } catch (exception) {
        next(exception)
    }
})

// ADMIN FEATURE: DELETE PRODUCT CATEGORY

categoriesRouter.delete('/:id', async (request, response, next) => {
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
        await Category.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }

})

// ADMIN FEATURE: UPDATE PRODUCT CATEGORY

categoriesRouter.put('/:id', async (request, response, next) => {
    const body = await request.body

    const token = getTokenFrom(request)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    } catch (exception) {
        next(exception)
    }

    const category = {
        name: body.name,
        description: body.description
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(request.params.id, category)

        response.json(updatedCategory.toJSON())

    } catch (exception) {
        next(exception)
    }
})

module.exports = categoriesRouter