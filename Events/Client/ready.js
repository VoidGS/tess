const { Client } = require("discord.js");
const mongoose = require("mongoose");
const Database = process.env.DATABASE;

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */ 
    execute(client) {
        // console.log("Tess limda te amo");
        client.user.setActivity("SOU LINDA", {type: "COMPETING"});

        // function start() {
        //     setTimeout(function() {
        //         console.log('Bixa');
        //         client.users.cache.get('509552755703152640').send("Gay 🤮");
        //         start();
        //     }, 3000);
        // }
        // start();

        if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            // console.log("The client is now connected to the database.")
        }).catch((err) => {
            console.log(err)
        });
    }
}