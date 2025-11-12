const FeedbackResponse = require("../models/feedbackResponse");
const FeedbackForm = require("../models/feedbackForm");

const countResponsesByDepartment = async (departmentName) => {
  try {
    //  Get all forms for this department
    const forms = await FeedbackForm.find(
      { department: departmentName },
      "_id"
    );
    const formIds = forms.map((f) => f._id);

    //  Get all feedback responses for these forms
    const responses = await FeedbackResponse.find({ formId: { $in: formIds } });

    //  Initialize counters
    const counts = { Good: 0, Better: 0, Best: 0, Bad: 0 };

    //  Loop through responses and count
    responses.forEach((resp) => {
      resp.answers.forEach((ans) => {
        if (counts.hasOwnProperty(ans.response)) {
          counts[ans.response] += 1;
        }
      });
    });

    return counts;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = countResponsesByDepartment;
