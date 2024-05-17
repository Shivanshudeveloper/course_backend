const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: {
        type: Number,
        required: true,
        default: 1000, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Ambassadorcounter = mongoose.model('ambassadorcounter', ambassadorSchema);
module.exports = Ambassadorcounter;
