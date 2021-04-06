import {Command} from "../../types/command";
import {generateAuthUrl} from "../../services/twitter";

export const login: Command = {
  aliases: ["login"],
  description: "Starts twitter login",
  inhibitors: [],
  async run(message, args) {
    const url = await generateAuthUrl(message.author.id);
    await message.author.send(url);
  },
};
