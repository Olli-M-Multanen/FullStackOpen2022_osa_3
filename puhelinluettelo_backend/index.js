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

// Hardcoded data example
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]

// API routes
const timeNow = new Date()
const arrCount = persons.length

app.get('/api/info', (req, res) => {
    res.send(
        `<div>
            <p>Phonebook has info for ${arrCount} people </p>
            <p>${timeNow} </p>
        </div>
        `)
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
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res
        .status(400)
        .json({ error: "contact name is missing"})
    } else if (body.number === null) {
        return res
        .status(400)
        .json({ error: "contact number is missing"})
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save().then(savedContact => {
        res.json(savedContact)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === "CastError") {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})