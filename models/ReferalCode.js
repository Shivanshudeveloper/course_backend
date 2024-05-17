const mongoose = require('mongoose');

const referalCodeSchema = new mongoose.Schema({
    referalCode: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const referalCode = mongoose.model('referalCode', referalCodeSchema);
module.exports = referalCode;
