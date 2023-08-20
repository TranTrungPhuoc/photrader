const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fullname: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    content: { type: String, require: true },
    status: { type: Boolean, default: true },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('contact', schema)