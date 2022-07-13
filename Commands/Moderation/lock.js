const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Structures/Schemas/LockDown");
const ms = require("ms");

module.exports = {
    name: "lock",
    description: "Lockdown this channel",
    options: [
        {
            name: "time",
            description: "Expire date for this lockdown (1m, 1h, 1d).",
            type: "STRING"
        },
        {
            name: "reason",
            description: "Provide a reason for this lockdown.",
            type: "STRING"
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, channel, options } = interaction;

        const Reason = options.getString("reason") ? `Reason: ${options.getString("reason")}` : ""

        const Embed = new MessageEmbed();

        if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES")) {
            return interaction.reply({ 
                embeds: [Embed.setColor("RED").setDescription("⛔ | This channel is already locked.")], 
                ephemeral: true 
            });
        }

        channel.permissionOverwrites.edit(guild.id, {
            SEND_MESSAGES: false
        });

        interaction.reply({ 
            embeds: [Embed.setColor("RED").setDescription(`🔒 | This channel is now under lockdown. ${Reason}`)] 
        });

        const Time = options.getString("time");
        if (Time) {
            const ExpireDate = Date.now() + ms(Time);
            DB.create({ GuildID: guild.id, ChannelID: channel.id, Time: ExpireDate });

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {
                    SEND_MESSAGES: null
                });

                interaction.editReply({
                    embeds: [Embed.setColor("GREEN").setDescription("🔓 | The lockdown has been lifted.")]
                }).catch(() => {});

                await DB.deleteOne({ ChannelID: channel.id });
            }, ms(Time));
        }
    }
}