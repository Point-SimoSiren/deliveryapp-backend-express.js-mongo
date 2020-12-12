const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    deliveryDate: Date,
    orderDate: Date,
    delivered: Boolean,
    totalPrice: Number,
    paid: Boolean,
    notes: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        pieces: Number,
        rowPrice: Number
    }],
})

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order