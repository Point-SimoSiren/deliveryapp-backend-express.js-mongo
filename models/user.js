const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'username is mandatory']
    },
    name: {
        type: String,
        unique: true,
        required: [true, 'name is mandatory']
    },
    address: {
        type: String,
        required: [true, 'address is mandatory']
    },
    phone: {
        type: String,
        required: [true, 'phone is mandatory']
    },
    email: {
        type: String,
        required: [true, 'email is mandatory']
    },
    admin: {
        type: Boolean,
        required: [true, 'admin is mandatory']
    },
    passwordHash: {
        type: String,
        required: [true, 'password is mandatory']
    }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash //ei nähtäväksi
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User