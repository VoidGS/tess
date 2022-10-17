const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const path = require("path");

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages], 
    partials: [User, Message, GuildMember, ThreadMember]
});

require("dotenv").config({path: path.resolve(__dirname, '.env')});

const { loadEvents } = require("./Handlers/eventHandler");
const { connect } = require("mongoose");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

connect(process.env.DATABASE, {

}).then(() => { console.log("The client is now connected to the database") });

loadEvents(client);

client.login(process.env.TOKEN);