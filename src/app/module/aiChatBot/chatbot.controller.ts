import { Request, Response } from "express";
import { getHealthAdviceFromAI } from "./chatbot.service";

export const ChatWithAIController = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const aiAnswer = await getHealthAdviceFromAI(message);

    res.status(200).json({
      success: true,
      data: aiAnswer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong with AI",
    });
  }
};
