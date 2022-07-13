const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Ping",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        interaction.reply({content: "PONG"})
    }
}