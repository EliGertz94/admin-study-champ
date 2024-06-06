// scripts/updateQuestions.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Question = require("../models/question"); // Use the temporary CommonJS model

const updateQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ID, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update all questions to include the tags field with an empty array if not already present
    await Question.updateMany(
      { tags: { $exists: false } },
      { $set: { tags: [] } }
    );

    console.log("All questions updated successfully to include tags field");
  } catch (err) {
    console.error("Error updating questions:", err);
  } finally {
    mongoose.connection.close();
  }
};

updateQuestions();
