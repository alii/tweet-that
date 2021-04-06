import {Command} from "../../types/command";
import {generateAuthUrl, twitterClient} from "../../services/twitter";
import {redis} from "../../services/redis";

export const login: Command = {
  aliases: ["login"],
  description: "Starts twitter login",
  inhibitors: [],
  async run(message, args) {
    const url = await generateAuthUrl();
    await message.author.send(url);
  },
};
