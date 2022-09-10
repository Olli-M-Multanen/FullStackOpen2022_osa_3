// Backend server with Node.js + Express example
// start server with - nodemon -,  command line:
// local version : npm run dev
// deploy to .fly and open: npm run deploy:full

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
// Middleware HTTP request logger "Morgan"
const morgan = require('morgan')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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
app.get('/api/persons/:id', (req, res) => {
    Contact.findById(req.params.id).then(contact => {
        res.json(contact)
    })
})

// DELETE contact
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Contact.findById(req.params.id).then(contact => {
        try {
            contact.deleteOne({ "_id" : id})
            console.log(`deleted ${contact.name} from database`)
            res.status(200).end()
        } catch (e) {
            console.log(e)
        }
    })
})

// ADD new contact
app.post('/api/persons', (req, res) => {
    const body = req.body
    const alreadyExists = persons.find(person => person.name === body.name)

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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})