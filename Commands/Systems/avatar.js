const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Displays a user avatar.",
    options: [
        {
            name: "target",
            description: "Select the target.",
            type: "USER",
            required: false
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { options, user, member } = interaction;
        const target = options.getMember("target");
        const displayMember = target != null ? target : member

        let footer = {
            text: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        const Embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`📁 **${displayMember.nickname != null ? displayMember.nickname : displayMember.user.username}** avatar's`)
            .setImage(displayMember.user.avatarURL({dynamic: true, size: 512}))
            .setFooter(footer)

        interaction.reply({embeds: [Embed]});
    }
}