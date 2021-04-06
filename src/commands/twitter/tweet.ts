import {Command} from "../../types/command";
import {findTwitterUser, generateTweetClient} from "../../services/twitter";
import {findOneByDiscordId} from "../../services/prisma";

export const tweet: Command = {
  aliases: ["tweet"],
  description: "Starts twitter login",
  inhibitors: [],
  async run(message) {
    const messageId = message.reference?.messageID;

    if (!messageId) {
      return;
    }

    const foundMessage = await message.channel.messages.fetch(messageId);

    if (!foundMessage) {
      return;
    }

    const client = await generateTweetClient(message.author.id);

    const foundUser = await findOneByDiscordId(foundMessage.author.id);

    const twitterUser = (await findTwitterUser(foundUser?.uid))[0];

    const tweet = await client.tweets
      .statusesUpdate({
        status: twitterUser
          ? `@${twitterUser["screen_name"] + " " + foundMessage.content}`
          : foundMessage.content,
      })
      .catch(() => null);

    if (tweet) {
      await foundMessage.react("<:twitter:829103050132029461>");
      await message.reply(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
    } else {
      await message.reply("Couldn't Tweet that!");
    }
  },
};
