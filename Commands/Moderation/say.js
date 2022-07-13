const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "say",
    description: "Says the message",
    options: [
        {
            name: "text",
            description: "What the bot should say",
            type: "STRING",
            required: true
        },
        {
            name: "amount",
            description: "Select the amount of times to send this message.",
            type: "NUMBER",
            required: false
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { options } = interaction;

        const Message = options.getString("text");
        const Amount = options.getNumber("amount");

        interaction.reply({content: "Done!", ephemeral: true});

        if (Amount) {
            let i = 0;
            while (i < Amount) {
                interaction.channel.send(Message);
                i++;
            }
        } else {
            interaction.channel.send(Message);
        }
    }
}