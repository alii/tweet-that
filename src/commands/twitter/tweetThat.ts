import {Command} from "../../types/command";
import {findTwitterUser, generateTweetClient} from "../../services/twitter";
import {findOneByDiscordId} from "../../services/prisma";

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

        const foundUser = await findOneByDiscordId(foundMessage.author.id);

        const twitterUser = (await findTwitterUser(foundUser?.uid))[0];

        const tweet = await client.tweets.statusesUpdate({
          status: twitterUser
            ? `@${twitterUser["screen_name"] + " " + foundMessage.content}`
            : foundMessage.content,
        });

        if (tweet) {
          await foundMessage.react("<:twitter:829103050132029461>");
          await message.reply("Tweeted that!");
        } else {
          await message.reply("Couldn't Tweet that!");
        }

        return;
      }
    }
  },
};
