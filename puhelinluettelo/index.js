// Backend server with Node.js + Express example
// start server with - nodemon -,  command line:
// npm run dev


const express = require('express')
const app = express()

app.use(express.json())

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
    {
        id: 5,
        name: "John Doe",
        number: "33-1617832"
    }
]

// API routes

// GET all
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// GET id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})


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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})