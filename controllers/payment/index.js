const User_Model = require('../../models/User');
const RegisteredUsers_Model = require('../../models/RegisteredUsers');

const AmbassadorPayout_Model = require('../../models/AmbassadorPayout');
const Ambassador_model = require("../../models/Ambassador"); // Update the path as needed


require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { APP_URL } = require("../../config/config");
const sendEmailResend = require("../../lib/resend_email").sendEmail;

const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');



const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_SECRET;


// Create User Checkout Session
const createCheckoutSession = async (req, res) => {
    try {
        const { customerId, priceId } = req.body;

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${APP_URL}/dashboard/app`,
            cancel_url: `${APP_URL}/plan`,
        });
        
        res.status(200).send({ sessionId: session.id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}


// Create User Checkout Session
const checkSubscriptionStatus = async (req, res) => {
    try {
        const { customerId } = req.params;

        User_Model.findOne({ customerId })
            .then(async (data) => {
                const subscriptionId = data?.subscriptionId;
                const alertSeen = data?.alertSeen;
                // Check Subsription Status
                const subscriptionUser = await stripe.subscriptions.retrieve(subscriptionId);
                var data = {
                    status: subscriptionUser.status,
                    current_period_end: subscriptionUser.current_period_end,
                    alertSeen
                }
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
        
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// Create User Checkout Session
const alertSeen = async (req, res) => {
    try {
        const { customerId } = req.params;

        User_Model.updateOne({ customerId }, { $set: {alertSeen: true } })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
        
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// Create User Checkout Session
const createRazorpayOrder = async (req, res) => {
    const { amount } = req.body;

    const receipt = `receipt_${Date.now()}`;

    try {
        const instance = new Razorpay({
            key_id: `${keyId.toString()}`,
            key_secret: `${keySecret.toString()}`,
        });

        const options = {
            amount: amount*100, // amount in smallest currency unit
            currency: "INR",
            receipt: receipt,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

const successRazorPay = async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            fullName,
            email,
            phone,
            institutionName,
            packagePlan,
            course,
            ambasadorId,
            referalCode,
            ccsmode,
            dsamode,
            mlmode
        } = req.body;

        
        const existingUser = await RegisteredUsers_Model.findOne({ email, packagePlan, institutionName, fullName });

        if (existingUser) {
            return res.status(400).json({ status: false, data: 'User already registered for the course' });
        }

        try {

            if (ambasadorId === "NA") {
                const newUser = new RegisteredUsers_Model({
                    fullName,
                    email,
                    phone,
                    institutionName,
                    packagePlan,
                    course,
                    paymentInformation: {
                        orderCreationId,
                        razorpayPaymentId,
                        razorpayOrderId,
                        razorpaySignature
                    },
                    ambasadorId,
                    referalCode,
                    ccsmode,
                    dsamode,
                    mlmode
                });
                const userres = await newUser.save();
                console.log(userres);
                // sendEmailResend(fullName, email, packagePlan, userres?._id);
                return res.status(200).json({ status: true, msg: 'success', orderId: razorpayOrderId, paymentId: razorpayPaymentId, userId: userres?._id });
            } else {
                const ambPayout = await Ambassador_model.findOne({ pubicId: ambasadorId });

                const newUser = new RegisteredUsers_Model({
                    fullName,
                    email,
                    phone,
                    institutionName,
                    packagePlan,
                    course,
                    paymentInformation: {
                        orderCreationId,
                        razorpayPaymentId,
                        razorpayOrderId,
                        razorpaySignature
                    },
                    ambasadorId,
                    referalCode,
                    ccsmode,
                    dsamode,
                    mlmode
                });

                const userres = await newUser.save();

                console.log(userres);

                const newAmbasadorPayout = new AmbassadorPayout_Model({
                    ambasadorId,
                    ambasadorPayout: ambPayout?.payout,
                    fullName,
                    email,
                    institutionName,
                    packagePlan,
                    course,
                    paymentInformation: {
                        orderCreationId,
                        razorpayPaymentId,
                        razorpayOrderId,
                        razorpaySignature
                    }
                });

                const ambpayout = await newAmbasadorPayout.save();

                console.log(ambpayout);

                return res.status(200).json({ status: true, msg: 'success', orderId: razorpayOrderId, paymentId: razorpayPaymentId, userId: userres?._id });
            }
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

// Create User Checkout Session
const sendEmailTest = async (req, res) => {
    try {
        sendEmailResend("Vivek Singh", "Viveksigh2004@gmail.com", "Machine Learning with Python: From Basics to Advanced, Rs. 4,499", "66857f997f296c2378001050");
        
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = {
    createCheckoutSession,
    checkSubscriptionStatus,
    alertSeen,
    createRazorpayOrder,
    successRazorPay,
    sendEmailTest
}