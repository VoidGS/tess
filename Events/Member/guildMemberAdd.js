const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {
        const { user, guild } = member;

        member.roles.add("938841492972265514");
        
        const Welcomer = new WebhookClient({
            id: "937405378092740619",
            token: "-sw8YAFVkeEg6CrxaLXiHVvyDp4uPQe45ZidpxivEXKfVfiGqdXI7G6BarAzJfySHHQC"
        });

        let author = {
            name: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        const Welcome = new MessageEmbed()
        .setColor("AQUA")
        .setAuthor(author)
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        Welcome ${member} to the **${guild.name}**!\n
        Account Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nLatest member count: **${guild.memberCount}**`)
        .setFooter(`ID: ${user.id}`)

        Welcomer.send({embeds: [Welcome]})
    }
}