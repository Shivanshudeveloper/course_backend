const mongoose = require('mongoose');

const ambassadorPayoutSchema = new mongoose.Schema({
    ambasadorId: {
        type: String,
        required: false,
    },
    ambasadorPayout: {
        type: String,
        required: false,
    },
    fullName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    institutionName: {
        type: String,
        required: false,
    },
    packagePlan: {
        type: String,
        required: false,
    },
    course: {
        type: String,
        required: false,
    },
    paymentInformation: {
        type: Object,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const AmbassadorPayout = mongoose.model('ambassadorpayout', ambassadorPayoutSchema);
module.exports = AmbassadorPayout;
