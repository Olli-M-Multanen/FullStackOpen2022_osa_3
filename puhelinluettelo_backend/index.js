// Backend server with Node.js + Express example
// start server with - nodemon -,  command line:
// local version : npm run dev
// deploy to .fly and open: npm run deploy:full

// require .dotenv always first
require('dotenv').config()

// Middlewaret in correct order
const express = require('express')
const app = express()
const Contact = require('./models/contact')

const cors = require('cors')
// Middleware HTTP request logger "Morgan"
app.use(express.static('build'))
app.use(express.json())
const morgan = require('morgan')


// Morgan Logger way to get the entire response body
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))

// morgan.token('body', function (req, res) {
//     return JSON.stringify([req.body])
// })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :param[name] :param[number]' ))
// Custom Morgan token which returns specifically requested data from body
morgan.token('param', function(req, res, param) {
    return req.body[param]
})

app.use(cors())

// API routes

app.get('/api/info', (req, res) => {
    const timeNow = new Date()
    Contact.countDocuments({}).then(contactCount => {
        res.send(
            `<div>
                <p>Phonebook has info for ${contactCount} people </p>
                <p>${timeNow} </p>
            </div>
            `)
    })
})

// GET all contacts
app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
})

// GET contact
app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id).then(contact => {
        if (contact) {
            res.json(contact)
        } else {
            res.status(404).end()
        }
    })
})

// DELETE contact
app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndDelete(req.params.id)
    .then(contact => {
        res.status(204).end()
        console.log(`deleted ${contact.name} from database`)
    }).catch (error => next(error)) 
    })

// ADD new contact
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (body.name === undefined) {
        return res
        .status(400)
        .json({ error: "contact name is missing"})
    } else if (body.number === null) {
        return res
        .status(400)
        .json({ error: "contact number is missing"})
    } else {
        const contact = new Contact({
            name: body.name,
            number: body.number
        })
        
        contact.save()
            .then(savedContact => {
            res.json(savedContact)
        })
        .catch(error => next(error))
    }
})

// UPDATE contact
app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Contact.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query'})
        .then(updatedContact => {
            res.json(updatedContact)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === "CastError") {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: "input failed" })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})