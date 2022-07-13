const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require('discord.js');
require("dotenv").config();

module.exports = {
    name: "ticket",
    description: "Setup your ticket message.",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild } = interaction;

        const Embed = new MessageEmbed()
            .setAuthor({
                name: guild.name + " | Ticketing System",
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setDescription("Open a ticket to discuss any of the issues listen on the button.")
            .setColor('BLURPLE');

        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
            .setCustomId("player")
            .setLabel("Player Report")
            .setStyle("PRIMARY")
            .setEmoji("🎟️"),

            new MessageButton()
            .setCustomId("bug")
            .setLabel("Bug Report")
            .setStyle("SECONDARY")
            .setEmoji("🐞"),

            new MessageButton()
            .setCustomId("other")
            .setLabel("Other Report")
            .setStyle("SUCCESS")
            .setEmoji("📮"),
        );

        await guild.channels.cache.get(process.env.OPENTICKETID).send({ embeds: [Embed], components: [Buttons] });

        interaction.reply({ content: "Done", ephemeral: true });
    }
}