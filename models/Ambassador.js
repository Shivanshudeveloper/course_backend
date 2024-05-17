const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    payout: {
        type: Number,
        required: false,
    },
    pubicId: {
        type: Number,
        required: false,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Ambassador = mongoose.model('ambassador', ambassadorSchema);
module.exports = Ambassador;
