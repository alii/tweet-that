import {Command} from "../../types/command";
import {findOneByDiscordId} from "../../services/prisma";
import {twitter} from "../../services/twitter";

export const whoami: Command = {
  aliases: ["whoami"],
  description: "Find out who you connected as",
  inhibitors: [],
  async run(message) {
    const member = await findOneByDiscordId(message.author.id);

    if (!member) {
      throw new Error("You have not connected your account.");
    }

    const usersList = await twitter.accountsAndUsers.usersLookup({user_id: member.uid});
    const user = usersList[0] ?? null;

    if (!user) {
      throw new Error("Unknown connection!");
    }

    await message.channel.send(`you connected as @${user.screen_name}`);
  },
};
