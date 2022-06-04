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
        client.user.setActivity("NICOLAS CADELA", {type: "COMPETING"});

        require("../../Systems/LockdownSys")(client);

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