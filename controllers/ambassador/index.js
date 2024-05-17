const ProjectTimeline_model = require("../../models/projectTimeline"); // Update the path as needed
const ReferalCode_model = require("../../models/ReferalCode"); // Update the path as needed
const AmbassadorCounter_model = require("../../models/AmbassadorCounter"); // Update the path as needed
const Ambassador_model = require("../../models/Ambassador"); // Update the path as needed


// Create a new project
const createAmbassador = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const requestData = req.body;

    const counter = await AmbassadorCounter_model.findByIdAndUpdate(
        'ambassadorId',
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

  try {
    const newambassador = new Ambassador_model({
        fullName: requestData?.fullName,
        email: requestData?.email,
        payout: requestData?.payout,
        pubicId: counter.sequence_value,
    });

    const resdata = await newambassador.save();

    return res.status(200).json({ status: true, data: resdata });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while creating referal code" });
  }
};

// Get a project by ID
const getReferalCode = async (req, res) => {
  {
    const { code } = req.params;
    try {
        ReferalCode_model.findOne({ referalCode: code }).sort({ date: -1 })
            .then((data) => {
                res.status(200).json({ status: true, data });
            })
            .catch((err) => console.log(err));

    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, data: "Error while fetching projects" });
    }
    }   
};

// Update a project by ID
const updateProjectById = async (req, res) => {
  const { organizationId } = req.params; // Use organisationId
  const updateData = req.body;

  try {
    const updatedProject = await ProjectTimeline_model.findOneAndUpdate(
      { organizationId }, // Use organisation_id
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ status: false, data: "Project not found" });
    }

    return res.status(200).json({ status: true, data: updatedProject });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while updating Project" });
  }
};


// Delete a project by ID
const deleteReferal = async (req, res) => {
  const { referalCode } = req.params; // Use organisationId

  try {
    const deletedReferal = await ReferalCode_model.findOneAndDelete({
        referalCode, // Use organisation_id
    });

    if (!deletedReferal) {
      return res.status(404).json({ status: false, data: "Referal not found" });
    }

    return res.status(200).json({ status: true, data: deletedReferal });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while deleting Project" });
  }
};


// Get all projects
const getAllAmbassador = async (req, res) => {
  try {
    const referals = await Ambassador_model.find().sort({ date: -1 });;

    return res.status(200).json({ status: true, data: referals });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, data: "Error while fetching Referals" });
  }
};

module.exports = {
    createAmbassador,
    getReferalCode,
    updateProjectById,
    deleteReferal,
    getAllAmbassador,
};
