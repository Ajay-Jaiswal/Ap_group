const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const employeeSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true 
    },
    lname: {
        type: String,
        required: true
    },
    company: {
        type: ObjectId,         
        ref: 'company',
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,         
        ref: 'user' 
    },
    isDeleted: {
        type: Boolean,
        default : false
    },
    deletedAt: {
        type: Date,
        default: null
    },

}, { timestamps: true })

module.exports = mongoose.model('employee', employeeSchema)

//  First name (required), last name (required), 6)Company (foreign key to Companies), email, phone

