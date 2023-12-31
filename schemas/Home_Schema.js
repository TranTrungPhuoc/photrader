const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    icon: { type: String, default: '' },
    type: { type: String, default: '' },
    topic: { type: String, default: '' },
    value: { type: String, default: '' },
    sort: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    userID: { type: mongoose.Types.ObjectId, default: null },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('home', schema)