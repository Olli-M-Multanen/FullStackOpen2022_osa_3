const mongoose = require('mongoose')


const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = 
    `mongodb+srv://FullStackAdm:${password}@cluster0.erxwohx.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: Number
})
const Contact = mongoose.model('Contact', contactSchema)


if (process.argv.length > 5) {
    console.log('ERROR: Too many arguments')
    process.exit(1)
} else if(process.argv.length == 5) {
    addNewContact()
} else if(process.argv.length == 4) {
    console.log("ERROR: contact number missing")
    process.exit(1)
} else if (process.argv.length == 3) {
    printAllContacts()
} else if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

function addNewContact() {
    // Add a new contact
    const contact = new Contact({
        name: newName,
        number: newNumber
    })

    contact.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
    }

function printAllContacts() {
    // Iterate over all contacts
    Contact.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}
