import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ["child", "teen", "adult"],
      required: true,
    },
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "kinesthetic", "reading/writing", "mixed"],
      required: true,
    },
    interestAreas: [
      {
        type: String,
        enum: [
          "math",
          "programming",
          "science",
          "literature",
          "history",
          "art",
          "languages",
          "other",
        ],
      },
    ],
    educationalLevel: {
      type: String,
      enum: [
        "elementary",
        "middle school",
        "high school",
        "college",
        "graduate",
        "professional",
        "other",
      ],
      required: true,
    },
    goals: { type: String }, // e.g., "learn basics", "deep dive", "career advancement"
    availableTimePerWeek: { type: Number, required: true }, // hours
    preferredCourseType: {
      type: String,
      enum: [
        "supplement",
        "full-course",
        "short-course",
        "workshop",
        "interactive",
      ],
      required: true,
    },
    curiosityDriven: { type: Boolean, default: false },
    preferredPace: {
      type: String,
      enum: ["self-paced", "instructor-led", "blended"],
      required: true,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    accessibilityNeeds: {
      type: [String],
      enum: ["none", "visual", "auditory", "motor", "cognitive"],
      default: ["none"],
    },
    languagePreference: {
      type: String,
      enum: ["English", "Spanish", "French", "German", "Chinese", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

export const UserPreferences =
  mongoose.models.UserPreferences ||
  mongoose.model("UserPreferences", userPreferencesSchema);
