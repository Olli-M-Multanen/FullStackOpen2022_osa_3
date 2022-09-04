// Backend server with Node.js + Express example
// start server with - nodemon -,  command line:
// local version : npm run dev
// deploy to .fly and open: npm run deploy:full

const express = require('express')
const cors = require('cors')

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
    res.json(persons)
})

// GET contact
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = persons.find(contact => contact.id === id)
    if (contact) {
        res.json(contact)
    } else {
        res.status(404).end()
    }
})

// DELETE contact
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const deleted = persons.find(person => person.id === id)
    if (deleted) {
        persons = persons.filter(person => person.id !== id)
        res.status(200).json(deleted)
    } else {
        res
        .status(404)
        .json({message: "Contact not found"})
    }

    res.status(204).end
})

// ADD new contact
const generateId = (min, max) => {
    min = Math.ceil(persons.length)
    max = Math.floor(10000)

    return Math.floor(Math.random() * (max - min))
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    const alreadyExists = persons.find(person => person.name === body.name)

    if (!body.name) {
        return res
        .status(400)
        .json({ error: "contact name is missing"})
    } else if (!body.number) {
        return res
        .status(400)
        .json({ error: "contact number is missing" })
    } else if (alreadyExists) {
        return res
        .status(400)
        .json({ error: "contact already exists" })
    } else {
        const contact = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }
        persons = persons.concat(contact)
        res
        .status(200)
        .json(contact)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})