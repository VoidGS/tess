const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "suggest",
    description: "Create a suggestion in an organized matter.",
    options: [
        {
            name: "type",
            description: "Select the type.",
            required: true,
            type: "STRING",
            choices: [
                {
                    name: "Command",
                    value: "Command"
                },
                {
                    name: "Event",
                    value: "Event"
                },
                {
                    name: "System",
                    value: "System"
                }
            ]
        },
        {
            name: "name",
            description: "Provide a name for your suggestion.",
            type: "STRING",
            required: true,
        },
        {
            name: "functionality",
            description: "Describe the functionality of this suggestion.",
            type: "STRING",
            required: true,
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user } = interaction;

        const type = options.getString("type");
        const name = options.getString("name");
        const funcs = options.getString("functionality");

        let author = {
            name: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        const Response = new MessageEmbed()
        .setColor("AQUA")
        .setDescription(`${interaction.member} has suggested a ${type}.\n\n ⬇💡`)
        .setAuthor(author)
        .addField("Name", `${name}`, true)
        .addField("Functionality", `${funcs}`, true);

        const message = await interaction.reply({embeds: [Response], fetchReply: true});
        message.react("<:check:851120498439356417>")
        message.react("<:x_:851120498981208084>")
    }
}