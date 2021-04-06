import {Command} from "../../types/command";

export const ping: Command = {
  aliases: ["ping", "pi"],
  description: "Checks that the bot is online",
  inhibitors: [],
  async run(message) {
    const now = Date.now();
    const cachedMessage = await message.reply("Pong... ⏱️");
    await cachedMessage.edit(`Pong! API Latency: ${Date.now() - now}ms`);
  },
};
