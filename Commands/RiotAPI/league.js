const { CommandInteraction, MessageEmbed } = require("discord.js");
const http = require('http');
const https = require('https');
require("dotenv").config();
const apiKey = process.env.RIOT_API_KEY;

module.exports = {
    name: "league",
    description: "Select an option to get the league info about.",
    options: [
        {
            name: "summoner",
            description: "Get summoner info.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "region",
                    description: "Select the region.",
                    type: "STRING",
                    choices: [
                        { name: "Brazil", value: "br1" },
                        { name: "Europe Nordic & East", value: "eun1" },
                        { name: "Europe West", value: "euw1" },
                        { name: "Japan", value: "jp1" },
                        { name: "Korea", value: "kr" },
                        { name: "Latin America North", value: "la1" },
                        { name: "Latin America South", value: "la2" },
                        { name: "North America", value: "na1" },
                        { name: "Oceania", value: "oc1" },
                        { name: "Turkey", value: "tr1" },
                        { name: "Russia", value: "ru" }
                    ],
                    required: true
                },
                {
                    name: "username",
                    description: "Type the username.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "profile",
            description: "Get your profile info.",
            type: "SUB_COMMAND"
        },
        {
            name: "add",
            description: "Link a summoner to your profile.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "region",
                    description: "Select the region.",
                    type: "STRING",
                    choices: [
                        { name: "Brazil", value: "br1" },
                        { name: "Europe Nordic & East", value: "eun1" },
                        { name: "Europe West", value: "euw1" },
                        { name: "Japan", value: "jp1" },
                        { name: "Korea", value: "kr" },
                        { name: "Latin America North", value: "la1" },
                        { name: "Latin America South", value: "la2" },
                        { name: "North America", value: "na1" },
                        { name: "Oceania", value: "oc1" },
                        { name: "Turkey", value: "tr1" },
                        { name: "Russia", value: "ru" }
                    ],
                    required: true
                },
                {
                    name: "username",
                    description: "Type the username.",
                    type: "STRING",
                    required: true
                }
            ],
        },
        {
            name: "remove",
            description: "Unlink a summoner from your profile.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "summoner",
                    description: "Select the region.",
                    type: "STRING",
                    choices: [
                        { name: "Summoner 1", value: "sum1" },
                        { name: "Summoner 2", value: "sum2" },
                        { name: "Summoner 3", value: "sum3" },
                    ],
                    required: true
                }
            ],
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user } = interaction;
        const emoji = {
            "IRON": interaction.client.emojis.cache.get("991491212789956618"),
            "BRONZE": interaction.client.emojis.cache.get("991491206242631711"),
            "SILVER": interaction.client.emojis.cache.get("991491216736800768"),
            "GOLD": interaction.client.emojis.cache.get("991491209749073941"),
            "PLATINUM": interaction.client.emojis.cache.get("991491215621103676"),
            "DIAMOND": interaction.client.emojis.cache.get("991491208897642526"),
            "MASTER": interaction.client.emojis.cache.get("991491214438318100"),
            "GRANDMASTER": interaction.client.emojis.cache.get("991491211665887232"),
            "CHALLENGER": interaction.client.emojis.cache.get("991491207714844682"),
        }

        var leagueVersion = undefined;

        https.get('https://ddragon.leagueoflegends.com/api/versions.json', (res) => {
            let rawData = '';
            res.on("data", (chunk) => {
                rawData += chunk;
            });

            res.on("end", () => {
                leagueVersion = JSON.parse(rawData)[0];
            })
        })

        switch (options.getSubcommand()) {
            case "summoner":
                const plataform = options.getString("region");
                const username = encodeURI(options.getString("username"));

                http.get(`http://localhost:8080/site/get-summoner?plataform=${plataform}&username=${username}&apiKey=${apiKey}`, (res) => {
                    let rawData = '';
                    res.on("data", (chunk) => {
                        rawData += chunk;
                    });

                    res.on("end", () => {
                        rawData = JSON.parse(rawData);

                        let summoner = rawData.summoner;
                        let queues = {};

                        rawData.entries.forEach(queue => {
                            queues[queue.queueType] = queue;
                        });

                        let soloQ = queues["RANKED_SOLO_5x5"];
                        let flexQ = queues["RANKED_FLEX_SR"];

                        let footer = {
                            text: user.tag,
                            iconURL: user.avatarURL({dynamic: true, size: 512})
                        }

                        const Embed = new MessageEmbed()
                        .setColor("BLURPLE")
                        .setTitle(summoner.name)
                        .setDescription(`Level: ${summoner.summonerLevel}`)
                        .addField("Solo Queue Stats", `${soloQ != undefined ? emoji[soloQ.tier] : ""} **${soloQ != undefined ? toTitleCase(soloQ.tier) : "Unranked"} ${soloQ != undefined ? soloQ.rank : ""}** \n **${soloQ != undefined ? soloQ.leaguePoints : "0"} LP** / ${soloQ != undefined ? soloQ.wins: "0"}W ${soloQ != undefined ? soloQ.losses : "0"}L \n Winrate: **${soloQ != undefined ? parseInt((soloQ.wins / (soloQ.wins + soloQ.losses)) * 100) : "0"}%**`, true)
                        .addField("Flex Queue Stats", `${flexQ != undefined ? emoji[flexQ.tier] : ""} **${flexQ != undefined ? toTitleCase(flexQ.tier) : "Unranked"} ${flexQ != undefined ? flexQ.rank : ""}** \n **${flexQ != undefined ? flexQ.leaguePoints : "0"} LP** / ${flexQ != undefined ? flexQ.wins: "0"}W ${flexQ != undefined ? flexQ.losses : "0"}L \n Winrate: **${flexQ != undefined ? parseInt((flexQ.wins / (flexQ.wins + flexQ.losses)) * 100) : "0"}%**`, true)
                        // .addField("Last Game", `**Ranked Flex** game as **Tryndamere** with **23/2/4** and **275CS**, 10 hours ago`, false)
                        .addField("Last Game", `W.I.P.`, false)
                        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${leagueVersion}/img/profileicon/${summoner.profileIconId}.png`)
                        .setFooter(footer)
                        .setTimestamp();

                        interaction.reply({ embeds: [Embed] });
                    })
                });
                break;

            default:
                break;
        }
    }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}