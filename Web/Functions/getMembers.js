const { Client } = require('discord.js');

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    var members = {};

    client.guilds.cache.forEach(guild => {
        guild.members.cache.forEach(member => {
            if (!(member.id in members)) {
                members[member.id] = {
                    id: member.id,
                    name: member.user.username,
                    nickname: member.nickname,
                    avatarURL: member.avatarURL()
                }
            }
        })
    });

    console.log(members);
}
