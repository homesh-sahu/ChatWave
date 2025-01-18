import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js';
import 'dotenv/config';
import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from "./src/lib/socket.js";

const port = process.env.PORT;

app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true   //Allows to send cookies and other data
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



server.listen(port, ()=>{
    console.log(`Server initialised at http://localhost:${port}`);

    connectDB();
}) 