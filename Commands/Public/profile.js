const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Display a user profile.")
    .addUserOption(options => options
        .setName("target")
        .setDescription("Select the target member")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user, member, client } = interaction;
        const target = options.getMember("target");
        const displayMember = target != null ? target : member;

        const emojis = {
            "user": "<:bustinsilhouette:1031635897319444480>",
            "briefcase": "<:briefcase_win11:1031640470662688859>",
            "tulip": "<:tulip_win11:1031641680245424251>",
            "watch": "<:watch_toss:1031643527496613918>",
            "watchw11": "<:watch_win11:1031643869831495750>"
        }

        const userData = await axios('https://discord.com/api/users/' + displayMember.id, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            },
        }).then((res) => res.data);

        const Embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`📁 **${displayMember.nickname != null ? displayMember.nickname : displayMember.user.username}** profile's`)
            .setThumbnail(displayMember.user.avatarURL())
            .addFields([
                { name: `${emojis.user} Username`, value: `${displayMember.user.tag}`, inline: true },
                { name: `${emojis.briefcase} Role`, value: `${displayMember.roles.highest}`, inline: true },
                { name: "⭒☆━━━━━━━━━━━━━━━━━━━━━━━☆⭒", value: `\u200b` },
                { name: `${emojis.tulip} Married to`, value: `${member}`, inline: true },
                { name: `${emojis.watchw11} Married since`, value: `<t:${parseInt(displayMember.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "\u200b", value: `** ⭒☆━━━━━━━━━━━━━━━━━━━━━━━☆⭒ **` },
                { name: `${emojis.watchw11} Member since`, value: `<t:${parseInt(displayMember.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: `${emojis.watchw11} Discord user since`, value: `<t:${parseInt(displayMember.user.createdTimestamp / 1000)}:R>`, inline: true },
            ])
            .setFooter({
                text: user.tag,
                iconURL: user.avatarURL()
            });

        if (userData.banner) {
            Embed.setImage(`https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}${(userData.banner).startsWith('a_') ? '.gif' : ''}?size=512`);
        }

        interaction.reply({embeds: [Embed]});
    }
}