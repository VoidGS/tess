const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "user info",
    type: "USER",
    permission: "ADMINISTRATOR",
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);
        const { user } = interaction;

        let author = {
            name: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        const Response = new MessageEmbed()
        .setColor("AQUA")
        .setAuthor(author)
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .addField("ID", `${target.user.id}`)
        .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"}`)
        .addField("Member since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
        .addField("Discord user since", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true);

        interaction.reply({embeds: [Response], ephemeral: true});
    }
}