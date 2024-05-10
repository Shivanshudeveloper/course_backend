const User_Model = require('../../models/User');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const checkUser = async (req, res) => {
    res.status(200).json({ status: true, data: true });
}

const addRegisteredUser = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const submitrequest = req.body;

    try {
        const organizationId = `${Date.now()}_${uuidv4()}`;
        const existingUser = await User_Model.findOne({ email: submitrequest.email });

        if (existingUser) {
            return res.status(400).json({ status: false, data: 'User already registered' });
        }

        try {
            const customer = await stripe.customers.create({ email: submitrequest?.email });
            
            const newUser = new User_Model({
                name: submitrequest.name,
                companyName: submitrequest.companyName,
                email: submitrequest.email,
                organizationId,
                plan: 'basic',
                apiKey: uuidv4(),
                accountStatus: 1,
                avatar: '',
                alertSeen: false,
                customerId: customer.id,
                termsAndCondition: submitrequest.termsAndCondition,
            });
    
            const userres = await newUser.save();

            return res.status(200).json({ status: true, payment_data: customer, user_data: userres });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: 'Registration failed' });
    }
};



// Get User Details
const getUserDetials = async (req, res) => {
    const { email } = req.params;
    User_Model.findOne({ email }).sort({ createdAt: -1 })
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
}

module.exports = {
    checkUser,
    addRegisteredUser,
    getUserDetials
}
