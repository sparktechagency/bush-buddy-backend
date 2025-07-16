/* eslint-disable @typescript-eslint/no-explicit-any */
import cron from "node-cron";
import { Chat } from "../app/modules/contextual/chat/chat.model";
import { globalGroupMessages, globalMessages } from "./io.live";

cron.schedule("* * * * * *", async () => {
  try {
    const batchSize = 200;

    const processBatch = async (messages: any[]) => {
      const batches = [];
      while (messages.length > 0) {
        batches.push(messages.splice(0, batchSize));
      }
      await Promise.all(batches.map((batch) => Chat.insertMany(batch)));
    };

    if (globalMessages.length > 0) {
      await processBatch(globalMessages);
    }

    if (globalGroupMessages.length > 0) {
      await processBatch(globalGroupMessages);
    }
  } catch (error) {
    console.info("🚀 cron.schedule error:", error);
  }
});
