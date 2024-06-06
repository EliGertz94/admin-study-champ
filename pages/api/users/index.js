import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/utils";
import { User } from "@/models/user"; // Ensure this is the correct path to your User model
import { UserProgress } from "@/models/userProgress";

const handler = async (req, res) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST") {
    const { username, email, password, phone, address } = req.body;
    let message = "";
    try {
      await connectToDB();

      if (!username || !email || !password) {
        message = "Missing required fields";
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("email exist already ");
        message = "Email already exists";
        return res.status(400).json({ message: message });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userProgress = new UserProgress({});
      await userProgress.save();

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        phone,
        address,
        userType: "student",
        isActive: true,
        progress: userProgress._id,
      });
      console.log(newUser);

      await newUser.save();

      userProgress.userId = newUser._id;
      await userProgress.save();

      return res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
