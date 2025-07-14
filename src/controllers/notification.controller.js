import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express"
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";


export const getNotification = asyncHandler(async(req,res) => {
    const { userId } = getAuth(req);
    const user = User.findOne({clerkId : userId});
    if(!user) return res.status(404).json({error : "User not found"});
    
    const notifications = await Notification.find({ to : user._id})
    .sort({createdAt : -1})
    .populate("from", " username firstname lastname profilePicture")
    .populate("post", "content image")
    .populate("comment", "content")

    res.status(200).json({ notifications });

});
export const deleteNotification = asyncHandler(async(req,res) => {
    const { notificationId } = req.params;
    const { userId } = getAuth(req);
    const user = User.findOne({clerkId : userId});
    if(!user ) return res.status(404).json({error : "User not found"});

    const notification = await Notification.findOneAndDelete({
        _id : notificationId,
        to : user._id
    });

    if(!notification) return res.status(404).json({ error : "Notification not found"});
    res.status(200).status({ message : "Notification is deleted"});

});
