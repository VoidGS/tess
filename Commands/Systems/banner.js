const { CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require('axios');

module.exports = {
    name: "banner",
    description: "Displays a user banner.",
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
            let footer = {
                text: user.tag,
                iconURL: user.avatarURL({dynamic: true, size: 512})
            }
    
            const Embed = new MessageEmbed()
                .setColor("BLURPLE")
                .setDescription(`📁 **${displayMember.nickname != null ? displayMember.nickname : displayMember.user.username}** banner's`)
                .setImage(`https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}${(userData.banner).startsWith('a_') ? '.gif' : ''}?size=512`)
                .setFooter(footer)
    
            interaction.reply({embeds: [Embed]});
        } else {
            interaction.reply({content: "😢 This user doesn't have a banner", ephemeral: true});
        }

    }
}