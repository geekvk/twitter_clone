import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js"
import { getAuth } from "@clerk/express"
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinery.js"
import upload from "../middleware/upload.middleware.js";
import Notification from "../models/notification.model.js";

export const getPosts = asyncHandler(async(req,res) => {
    const posts = await Post.find()
    .sort({ createdAt : -1 })
    .populate("user", "username firstname lastname profilePicture")
    .populate({
        path : "comments",
        populate : {
            path : "user",
            select : "username firstname lastname profilePicture"
        },
    });
    res.status(200).json({ posts })

});

export const getPost = asyncHandler(async(req,res) => {
    const { postId } = req.params;
    const post = await Post.byId({postId })
    .populate("user", "username firstname lastname profilePicture")
    .populate({
        path : "comments",
        populate : {
            path : "user",
            select : "username firstname lastname profilePicture"
        },
    });
    if(!post)
        res.status(404).json({message : "Post is not existing"});
    res.status(200).json({ post });


});

export const getUserPost = asyncHandler(async(req,res) => {
    const {username} = req.params;
    const user = Post.findOne({ username });
    if(!user)
        res.status(404).json({message : "User is not existing"});

    const posts = Post.findById({ user : user._id})
    .sort({ createdAt : -1 })
    .populate("user", "username firstname lastname profilePicture")
    .populate({
        path : "comments",
        populate : {
            path : "user",
            select : "username firstname lastname profilePicture"
        },
    });
    res.status(200).json({ posts })
});

export const createPost = asyncHandler(async(req, res) => {
    const{userId} = req.params;
    const imageFile = req.file;
    if(!content && !imageFile){
        res.status(400).json({error : " Post must be contain either text or image"});
    }
    const user = User.findOne({ clerkId : userId });
    if(!user) return res.status(400).json({ error : "User not found"});

    let imageUrl = ""
    if(imageFile){
        try{
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
                "base64"
            )}`;
            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder : "social_media_post",
                resource_type : "image",
                transformation : [
                    { width : 800, height : 600, crop : "limit"},
                    { quality : "auto"},
                    { format : "auto"}
                ]
            });
            imageUrl = uploadResponse.secure_url;
        }catch(uploadError){
            console.log("Cloudinary Upload error", uploadError);
            res.status(400).json({ erorr : "Failed to upload Image"})
        }
    }
    const post = await Post.create({
        user : user._id,
        content : content || "",
        image : imageUrl
    });
    res.status(201).json({ post : post });

});

export const likePost = asyncHandler(async(req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = User.findOne({ clerkId : userId });
    if(!user) return res.status(400).json({ error : "User not found"});

    const post = Post.findById(postId);
    if(!post) return res.status(400).json({ error : "post not found"});

    const isLiked = post.likes.includes(user._id);
    if(isLiked){
        //unlike
        await Post.findByIdAndUpdate(postId,{
            $pull : { likes : user._id}
        });
    }else{
        //like
        await Post.findByIdAndUpdate(postId,{
            $push : { likes : user._id}
        });
    }
    //create notification
    //notification
    await Notification.create({
        from : currentUser._id,
        to : post.user,
        type : "like",
        post : postId
    });
    res.status(200).json({
        message : isLiked ? "liked to the post" : "unliked to the post"
    });
})
