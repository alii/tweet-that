import {Command} from "../../types/command";
import {generateTweetClient, twitterClient} from "../../services/twitter";
import {prisma} from "../../services/prisma";

export const tweet: Command = {
  aliases: ["tweet"],
  description: "Starts twitter login",
  inhibitors: [],
  async run(message, args) {
    const messageId = message.reference?.messageID;
    if (messageId) {
      const foundMessage = await message.channel.messages.fetch(messageId);
      if (foundMessage) {
        const client = await generateTweetClient(message.author.id);
        const foundUser = await prisma.user.findFirst({
          where: {discord_id: foundMessage.author.id},
        });

        const twitterUser = await twitterClient.accountsAndUsers.usersLookup({
          user_id: foundUser?.uid,
        });

        const tweet = await client.tweets.statusesUpdate({
          status: twitterUser.length
            ? `@${twitterUser[0]["screen_name"] + " " + foundMessage.content}`
            : foundMessage.content,
        });

        if (tweet) {
          await message.reply("Tweeted that!");
        }
        return;
      }
    }
    await message.author.send("duh, not empty");
  },
};
