const People = require('../models/people.model'); // Make sure to adjust the path as needed

module.exports = async (req) => {
  try {
    const { reqEmail } = req.claims; 

    const user = await People.findOne({ reqEmail }).exec(); 

    if (!user) {
      throw new Error("User not found");
    }

    const { _id, email, firstName, lastName, avatar } = user;

    return {
      _id, 
      email,
      firstName,
      lastName,
      avatar,
      name: `${firstName} ${lastName}`,
    };
  } catch (e) {
    throw new Error(e.message);
  }
};
