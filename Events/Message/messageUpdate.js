const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    /**
     * 
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;

        if (oldMessage.content === newMessage.content) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");

        const Log = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle("📘 Message Log")
        .setDescription(`A [message](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}.\n
        **📑 Original:**\n \`${Original}\` \n\n**📝 Edited:**\n \`${Edited}\` `.slice("0", "4096"))
        .setFooter(`Member: ${newMessage.author.tag} | ID: ${newMessage.author.id}`, newMessage.author.avatarURL({dynamic: true}))

        new WebhookClient({url: "https://discord.com/api/webhooks/937512927966167100/VTZa1DEfMcowfmO1bLeIYiH7XpUwUxigG7Dx2-GI_6OKIJSep8xwkdhXvuxpc_MNlgTI"}
        ).send({embeds: [Log]}).catch((err) => console.log(err));
    }
}