import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password"); //All user but not (equals to) the current user

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(`Error while fetching all users for sidebar: ${error}`);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId: myId},
            ],
        }); //Retruns all the message between the current sender and receiver

        res.status(200).json(messages);
    } catch (error) {
        console.log(`Error while fetching messages: ${error}`);
        res.status(500).json({error: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            // Uploading image in base64 format in cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //Socket.io implementation for real-time chatting
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(`Error in sendMessage: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}