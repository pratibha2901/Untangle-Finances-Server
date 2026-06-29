import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routers/authRoutes.js";
import express from "express";
 const app = express();
 app.use('/api/auth', authRouter);
 app.use(errorMiddleware);