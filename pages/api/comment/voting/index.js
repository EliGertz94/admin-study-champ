import { connectToDB } from "@/lib/utils";
import { Comment } from "@/models/comment";

const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
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
  } else if (req.method === "PATCH") {
    const { commentId, userId, action } = req.body;

    if (!commentId || !userId || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (action === "upvote") {
        if (comment.upvotes.includes(userId)) {
          comment.upvotes = comment.upvotes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          comment.upvotes.push(userId);
          comment.downvotes = comment.downvotes.filter(
            (id) => id.toString() !== userId
          );
        }
      } else if (action === "downvote") {
        if (comment.downvotes.includes(userId)) {
          comment.downvotes = comment.downvotes.filter(
            (id) => id.toString() !== userId
          );
        } else {
          comment.downvotes.push(userId);
          comment.upvotes = comment.upvotes.filter(
            (id) => id.toString() !== userId
          );
        }
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      await comment.save();
      return res.status(200).json({ message: "Vote updated successfully." });
    } catch (error) {
      console.error("Error updating vote:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
};

export default handler;
