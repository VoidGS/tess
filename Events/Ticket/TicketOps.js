const { ButtonInteraction, MessageEmbed } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const DB = require('../../Structures/Schemas/Ticket');
require("dotenv").config();

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const { guild, customId, channel, member } = interaction;

        if (!member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "You cannot use these buttons.", ephemeral: true });
        if (!["close", "lock", "unlock"].includes(customId)) return;

        const Embed = new MessageEmbed().setColor("BLUE");

        DB.findOne({ ChannelID: channel.id }, async(err, docs) => {
            if (err) throw err;
            if (!docs) return interaction.reply({ content: "No data was found related to this ticket, please delete manually", ephemeral: true })
            
            switch (customId) {
                case "close":
                    if (docs.Closed == true) return interaction.reply({ content: "The ticket is already closed.", ephemeral: true });

                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${docs.Type} - ${docs.TicketID}.html`
                    });
                    
                    await DB.updateOne({ ChannelID: channel.id }, { Closed: true });

                    const MEMBER = guild.members.cache.get(docs.MemberID);

                    Embed.setAuthor({
                        name: MEMBER.user.tag,
                        iconURL: MEMBER.user.displayAvatarURL({ dynamic: true })
                    });
                    Embed.setTitle(`Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`);

                    const Message = await guild.channels.cache.get(process.env.TRANSCRIPTSID).send({ embeds: [Embed], files: [attachment] });

                    Embed.setDescription(`The transcript is now saved [TRASCRIPT](${Message.url})`);

                    interaction.reply({ embeds: [Embed] });

                    setTimeout(() => {
                        channel.delete();
                    }, 10 * 1000);
                    break;
            
                case "lock":
                    if (docs.Locked == true) return interaction.reply({ content: "The ticket is already locked.", ephemeral: true });
                    
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
                    Embed.setDescription("🔒 | This ticket is now locked for reviewing.");
                    channel.permissionOverwrites.edit(docs.MemberID, {
                        SEND_MESSAGES: false
                    });
                    interaction.reply({ embeds: [Embed] });
                    break;

                case "unlock":
                    if (docs.Locked == false) return interaction.reply({ content: "The ticket is already unlocked.", ephemeral: true });
                    
                    await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
                    Embed.setDescription("🔓 | This ticket is now unlocked.");
                    channel.permissionOverwrites.edit(docs.MemberID, {
                        SEND_MESSAGES: true
                    });
                    interaction.reply({ embeds: [Embed] });
                    break;
            
                default:
                    break;
            }
        });
        
    }
}