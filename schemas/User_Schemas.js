const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    phone: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, default: 'user' },
    status: { type: Boolean, default: true },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})
module.exports = mongoose.model('user', schema)