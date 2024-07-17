const RegisteredUsers_Model = require('../../models/RegisteredUsers');


// Get All Users
const getAllUsers = async (req, res) => {
    const { isadmin } = req.params; // Use organisationId
    console.log(isadmin);

    if (isadmin === "yes") {
        console.log("Admin");
        RegisteredUsers_Model.find({}).sort({ createdAt: -1 })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
    } else {
        console.log("Not Admin");
        RegisteredUsers_Model.find({ referalCode: "PIET24" }).sort({ createdAt: -1 })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));
    }
}

// Get All Users
const getAllUserDataCertificate = async (req, res) => {
    const { email } = req.params; // Use organisationId
    console.log(email);

    RegisteredUsers_Model.findOne({ email }).sort({ createdAt: -1 })
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
}

module.exports = {
    getAllUsers,
    getAllUserDataCertificate
}