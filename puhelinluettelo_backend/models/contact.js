const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        maxlength:12,
        minlength:10,
        validate: {
            validator: function(v) {
                return /^0\d{2}|0\d{1}-\d{7}|d{8}$/.test(v)
            },
            message: 'Phone number not valid'
        }
    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)