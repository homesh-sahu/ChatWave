import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js';
import 'dotenv/config';

import path from 'path';

import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from "./src/lib/socket.js";

const port = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true   //Allows to send cookies and other data
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
    })
}

server.listen(port, ()=>{
    console.log(`Server initialised at http://localhost:${port}`);

    connectDB();
}) 