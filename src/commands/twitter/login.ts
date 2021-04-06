import {Command} from "../../types/command";
import {generateAuthUrl} from "../../services/twitter";

export const login: Command = {
  aliases: ["login"],
  description: "Starts twitter login",
  inhibitors: [],
  async run(message) {
    const url = await generateAuthUrl(message.author.id);

    if (message.channel.type !== "dm") {
      await message.reply("Please check your DM!");
    }

    await message.author.send(url);
  },
};
