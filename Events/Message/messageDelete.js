const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageDelete",
    /**
     * 
     * @param {Message} message 
     */
    execute(message) {
        if (message.author.bot) return;

        const Log = new MessageEmbed()
        .setColor("RED")
        .setTitle("📕 Message Log")
        .setDescription(`A message by ${message.author.tag} was **deleted** in ${message.channel}.\n
        **🗑️ Deleted Message:**\n \`${message.content ? message.content : "None"}\` `.slice(0, 4096));

        if (message.attachments.size >= 1) {
            Log.addField(`📁 Attachments:`, `${message.attachments.map(a => a.url).join(" ")}`, true);
        }

        new WebhookClient({url: "https://discord.com/api/webhooks/937512927966167100/VTZa1DEfMcowfmO1bLeIYiH7XpUwUxigG7Dx2-GI_6OKIJSep8xwkdhXvuxpc_MNlgTI"}
        ).send({embeds: [Log]}).catch((err) => console.log(err));
    }
}