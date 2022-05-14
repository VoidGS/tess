const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const DB = require("../../Structures/Schemas/Ticket");
require("dotenv").config();

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { guild, member, customId } = interaction;
        if (!["player", "bug", "other"].includes(customId)) return;

        const ID = Math.floor(Math.random() * 90000) + 10000;

        await guild.channels.create(`${customId + "-" + ID}`, {
            type: "GUILD_TEXT",
            parent: process.env.TICKETPARENTID,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: process.env.EVERYONEID,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                }
            ]
        }).then(async (channel) => {
            await DB.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
            });

            const Embed = new MessageEmbed()
                .setAuthor({
                    name: `${guild.name} | Ticket: ${ID}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setDescription("Please wait for a response from the staff team, in the mean while, describe your issue.")
                .setFooter({
                    text: "The buttons below are Staff Only."
                })
                .setColor("BLURPLE");

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                .setCustomId("close")
                .setLabel("Save & Close Ticket")
                .setStyle("PRIMARY")
                .setEmoji("💾"),

                new MessageButton()
                .setCustomId("lock")
                .setLabel("Lock")
                .setStyle("DANGER")
                .setEmoji("🔒"),

                new MessageButton()
                .setCustomId("unlock")
                .setLabel("Unlock")
                .setStyle("SUCCESS")
                .setEmoji("🔓"),
            );

            channel.send({embeds: [Embed], components: [Buttons]});
            channel.send({content: `${member} here is your ticket.`}).then((m) => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                }, 1 * 5000);
            });

            if (interaction.replied) {
                interaction.editReply({content: `${member} your ticket has been created: ${channel}`, ephemeral: true});
            } else {
                interaction.reply({content: `${member} your ticket has been created: ${channel}`, ephemeral: true});
            }
        });
    }
}