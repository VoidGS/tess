const { VoiceState, Client } = require("discord.js");

module.exports = {
    name: "voiceStateUpdate",
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     * @param {Client} client 
     */
    execute(oldState, newState, client) {
        const { channel, channelId, member, guild } = oldState
        let url = null;

        if (channelId != null) return;

        switch (member.id) {
            case "216346025504276480":
                // Void
                url = "https://www.youtube.com/watch?v=4fS726EoWpg";
                break;
        
            case "509552755703152640":
                // Manu
                url = "https://www.youtube.com/watch?v=-OHNR8BcIQY";
                break;
        
            case "281533164726255617":
                // Crift
                url = "https://www.youtube.com/watch?v=a5O_vubRjyw";
                break;

            case "280168067311468544":
                // Kaio
                url = "https://www.youtube.com/watch?v=cdXaQPm_lNk";
                break;

            case "690379092289388586":
                // Mandi
                url = "https://www.youtube.com/watch?v=QdebM7O99A8";
                break;
                
            case "235941109686075392":
                // Ga
                url = "https://www.youtube.com/shorts/HnPIxS1XP2w";
                break;
                
            case "309878880867581952":
                // Juju
                url = "https://www.youtube.com/watch?v=vAnkXrYyPSE";
                break;
            
            case "756667278736752792":
                // Line
                url = "https://www.youtube.com/watch?v=7rMZjLFYQBQ";
                break;


            default:
                break;
        }

        if (url == null) return;

        client.distube.play(newState.channel, url, {
            textChannel: guild.channels.cache.get("937057843717210143"),
            member: member
        });
    }
}