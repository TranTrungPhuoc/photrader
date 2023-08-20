const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, require: true },
    svg: { type: String, default: '' },
    link: { type: String, default: '' },
    location: { type: String, default: '' },
    sort: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    userID: { type: mongoose.Types.ObjectId, default: null },
    created: { type: Date, default: new Date() },
    updated: { type: Date, default: null }
})

module.exports = mongoose.model('network', schema)