const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        loadCommands(client);
        
        console.log(`${client.user.username} logged in`);
        client.user.setActivity(`sou limda`);
    }
}