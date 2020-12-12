const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    package: {
        type: String
    },
    price: {
        type: Number
    },
    active: {
        type: Boolean
    },
    manufacturer: {
        type: String
    },
    description: {
        type: String
    },
    category:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
})

itemSchema.plugin(uniqueValidator)

itemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item