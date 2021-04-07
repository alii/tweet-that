import {prisma} from "../../services/prisma";
import {Command} from "../../types/command";

export const logout: Command = {
  description: "Remove your account from the database and delete your data",
  aliases: ["logout", "remove"],
  inhibitors: [],
  async run(message) {
    await prisma.user.delete({
      where: { discord_id: message.author.id },
    });

    await message.channel.send("Successfully removed your account");
  }
}
