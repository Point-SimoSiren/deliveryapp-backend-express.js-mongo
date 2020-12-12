const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// SELF-REGISTER ENDPOINT

usersRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            address: body.address,
            phone: body.phone,
            email: body.email,
            admin: body.admin,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

// TOKEN PROCESSOR FUNCION

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// ADMIN FEATURE: GET ALL USERS

usersRouter.get('/', async (request, response, next) => {

    const token = getTokenFrom(request)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    }
    catch (exception) {
        next(exception)
    }

    try {
        const users = await Users.find({})
        response.json(users.map(u => u.toJSON()))
    }
    catch (exception) {
        next(exception)
    }
})

// ADMIN FEATURE: DELETE USER

usersRouter.delete('/:id', async (request, response, next) => {
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
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})


// ADMIN FEATURE: UPDATE USER (IN FUTURE MIGHT BE ALSO FOR USER TO UPDATE OWN INFO)

usersRouter.put('/:id', async (request, response, next) => {
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

    const user = {
        username: body.username,
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        admin: body.admin,
        passwordHash
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, user)

        response.json(updatedUser.toJSON())

    } catch (exception) {
        next(exception)
    }
})


module.exports = usersRouter