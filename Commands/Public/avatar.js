const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display a user avatar.")
    .addUserOption(options => options
        .setName("target")
        .setDescription("Select the target member")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction) {
        const { options, user, member } = interaction;
        const target = options.getMember("target");
        const displayMember = target != null ? target : member

        const Embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`📁 **${displayMember.nickname != null ? displayMember.nickname : displayMember.user.username}** avatar's`)
            .setImage(displayMember.user.avatarURL({ size: 512 }))
            .setFooter({
                text: user.tag,
                iconURL: user.avatarURL()
            })

        interaction.reply({embeds: [Embed]});
    }
}