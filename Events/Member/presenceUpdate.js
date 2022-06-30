const { MessageEmbed, WebhookClient, Presence } = require("discord.js");

module.exports = {
    name: "presenceUpdate",
    /**
     * 
     * @param {Presence} oldPresence 
     * @param {Presence} newPresence 
     */
    execute(oldPresence, newPresence) {
        const { user, guild } = newPresence;

        console.log(user.tag + " has changed.");

        // newPresence.activities.forEach(a => {
        //     if (a.name == 'League of Legends') {
        //         if (a.assets.largeText) {
        //             console.log(a)
        //         } else {
        //             console.log("Not in-game")
        //         }
        //     }
        // })
    }
}