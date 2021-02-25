const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
})

categorySchema.plugin(uniqueValidator)

categorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category