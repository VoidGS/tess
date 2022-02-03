const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {
        const { user, guild } = member;

        const Loger = new WebhookClient({
            id: "937405378092740619",
            token: "-sw8YAFVkeEg6CrxaLXiHVvyDp4uPQe45ZidpxivEXKfVfiGqdXI7G6BarAzJfySHHQC"
        });

        let author = {
            name: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        const Welcome = new MessageEmbed()
        .setColor("RED")
        .setAuthor(author)
        .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
        .setDescription(`
        ${member} has left the server!\n
        Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nLatest member count: **${guild.memberCount}**`)
        .setFooter(`ID: ${user.id}`)

        Loger.send({embeds: [Welcome]})
    }
}