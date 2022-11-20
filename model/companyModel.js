const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId


const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true 
    },
    logo: {
        type: String,
    },
    website: {
        type: String, 
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

module.exports = mongoose.model('company', companySchema)

//Companies DB table consists of these fields: Name (required), email, logo (minimum 100×100), website