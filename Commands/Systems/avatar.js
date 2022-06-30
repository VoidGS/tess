const { CommandInteraction, MessageEmbed } = require("discord.js");
const Hypixel = require("hypixel-api-reborn");
const hypixel = new Hypixel.Client("9cc30192-b6f7-43d8-8297-caffb415bbfc");

module.exports = {
    name: "avatar",
    description: "Displays a user avatar.",
    permission: "MANAGE_MESSAGES",
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

        let author = {
            name: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        let footer = {
            text: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        const Embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`📁 **${displayMember.user.username}** avatar's`)
            .setImage(displayMember.user.avatarURL({dynamic: true, size: 512}))
            .setFooter(footer)

        interaction.reply({embeds: [Embed]});
    }
}