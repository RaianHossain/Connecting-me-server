const { mongoose } = require('../database/connect');

// Define the People schema
const peopleSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ // Basic regex for email validation
  },
  bio: {
    type: String
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create and export the People model
const People = mongoose.model('People', peopleSchema);

module.exports = People;
