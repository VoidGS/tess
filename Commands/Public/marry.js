const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Database = require("../../Schemas/Marriages");
const Canvas = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("Marry with someone.")
    .addUserOption(options => options
        .setName("target")
        .setDescription("Select the your love")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, member } = interaction;
        const target = options.getMember("target");

        const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('./Img/marry-back.jpg');

        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Using undici to make HTTP requests for better performance
        const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());

        // If you don't care about the performance of HTTP requests, you can instead load the avatar using
        // const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ extension: 'jpg' }));

        // Draw a shape onto the main canvas
        context.drawImage(avatar, 25, 25, 200, 200);

        // Use the helpful Attachment class structure to process the file for you
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'marriage.png' });

        const Embed = new EmbedBuilder()
            .setColor("LuminousVividPink")
            .setDescription(`**🌷 ${member} married ${target} 🌷**`)
            .setImage('attachment://marriage.png');

        return interaction.reply({
            embeds: [Embed],
            files: [attachment]
        });

        // Member
        let memberMarryData = await Database.findOne({
            Guild: guild.id,
            User: member.id
        });

        if (memberMarryData) {
            return interaction.reply({
                content: "You're already married to someone",
                ephemeral: true
            });
        }

        let memberMarriedData = await Database.findOne({
            Guild: guild.id,
            Couple: member.id
        });

        if (memberMarriedData) {
            return interaction.reply({
                content: "You're already married to someone",
                ephemeral: true
            });
        }

        // Target
        let targetMarryData = await Database.findOne({
            Guild: guild.id,
            User: target.id
        });

        if (targetMarryData) {
            return interaction.reply({
                content: "This member is already married to someone",
                ephemeral: true
            });
        }

        let targetMarriedData = await Database.findOne({
            Guild: guild.id,
            Couple: target.id
        });

        if (targetMarriedData) {
            return interaction.reply({
                content: "This member is already married to someone",
                ephemeral: true
            });
        }

        let marryData = await Database.create({
            Guild: guild.id,
            User: member.id,
            Couple: target.id,
            DateCreate: Date.now()
        });

        return interaction.reply({
            content: `You are now married to ${target}`
        });
    }
}