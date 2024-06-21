import { connectToDB } from "@/lib/utils";
import { Comment } from "@/models/comment";

const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  await connectToDB();

  if (req.method === "POST") {
    const { content, userId, parentCommentId, questionId } = req.body;

    if (!content || !userId || !questionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newComment = new Comment({
        content,
        userId,
        parentCommentId,
        questionId,
        upvotes: [],
        downvotes: [],
        createdAt: new Date(),
      });

      await newComment.save();
      return res.status(200).json({ message: "Comment added successfully." });
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    const { questionId, page, limit } = req.query;

    if (!questionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    try {
      const comments = await Comment.find({ questionId })
        .populate({
          path: "userId",
          populate: { path: "progress" }, // Populate the progress field of the user
        }) // Populate the user data for each comment
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      const totalComments = await Comment.countDocuments({ questionId });

      return res.status(200).json({
        comments,
        totalPages: Math.ceil(totalComments / limitNum),
        currentPage: pageNum,
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end();
  }
};

export default handler;
