import {MessageEmbed, MessageEmbedOptions, User} from "discord.js";

export class StandardEmbed extends MessageEmbed {
  constructor(user: User, data?: StandardEmbed | MessageEmbedOptions) {
    super(data);

    this.setTimestamp()
      .setColor("#36393F")
      .setFooter("Discord Bot")
      .setAuthor(user.tag, user.avatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png");
  }
}
