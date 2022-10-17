const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Display a user banner.")
    .addUserOption(options => options
        .setName("target")
        .setDescription("Select the target member")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user, member } = interaction;
        const target = options.getMember("target");
        const displayMember = target != null ? target : member;

        const userData = await axios('https://discord.com/api/users/' + displayMember.id, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            },
        }).then((res) => res.data);

        if (userData.banner) {
            const Embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`📁 **${displayMember.nickname != null ? displayMember.nickname : displayMember.user.username}** banner's`)
                .setImage(`https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}${(userData.banner).startsWith('a_') ? '.gif' : ''}?size=512`)
                .setFooter({
                    text: user.tag,
                    iconURL: user.avatarURL()
                })
    
            interaction.reply({embeds: [Embed]});
        } else {
            interaction.reply({content: "😢 This user doesn't have a banner", ephemeral: true});
        }
    }
}