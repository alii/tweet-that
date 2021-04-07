import {Command} from "../../types/command";

export const invite: Command = {
  aliases: ["invite"],
  description: "Gets the invite for the bot",
  inhibitors: [],
  async run(message) {
    await message.reply(
      `https://discord.com/api/oauth2/authorize?client_id=${message.client.user?.id}&permissions=0&scope=bot`
    );
  },
};
