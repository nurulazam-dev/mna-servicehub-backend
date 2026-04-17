import express, { Router } from "express";
import { ChatWithAIController } from "./chatbot.controller";

const router = express.Router();

router.post("/chat", ChatWithAIController);

export const AIRoutes: Router = router;
