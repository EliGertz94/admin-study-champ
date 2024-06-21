import { connectToDB } from "@/lib/utils";
import { User } from "@/models/user";
import { UserPreferences } from "@/models/preferences";

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  await connectToDB();

  if (req.method === "POST") {
    const {
      userId,
      ageGroup,
      learningStyle,
      interestAreas,
      educationalLevel,
      goals,
      availableTimePerWeek,
      preferredCourseType,
      curiosityDriven,
      preferredPace,
      notificationPreferences,
      accessibilityNeeds,
      languagePreference,
    } = req.body;

    if (
      !userId ||
      !ageGroup ||
      !learningStyle ||
      !interestAreas ||
      !educationalLevel ||
      !goals ||
      !availableTimePerWeek ||
      !preferredCourseType ||
      !curiosityDriven ||
      !preferredPace ||
      !notificationPreferences ||
      !accessibilityNeeds ||
      !languagePreference
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const uniqueInterestAreas = [...new Set(interestAreas)];
      const uniqueAccessibilityNeeds = [...new Set(accessibilityNeeds)];

      const preferences = new UserPreferences({
        userId,
        ageGroup,
        learningStyle,
        interestAreas: uniqueInterestAreas,
        educationalLevel,
        goals,
        availableTimePerWeek,
        preferredCourseType,
        curiosityDriven,
        preferredPace,
        notificationPreferences,
        accessibilityNeeds: uniqueAccessibilityNeeds,
        languagePreference,
      });

      await preferences.save();

      await User.findByIdAndUpdate(userId, {
        preferences: preferences._id,
        firstLogin: false,
      });

      return res
        .status(200)
        .json({ message: "Preferences saved successfully." });
    } catch (error) {
      console.error("Error saving preferences:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
};

export default handler;
