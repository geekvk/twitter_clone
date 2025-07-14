import express from "express";
import { createComment, deleteComment, getComments } from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/post/:postId", getComments);
router.post("/post/:postId", protectRoute, createComment);
router.post("/:commentId", protectRoute, deleteComment);


export default router;

