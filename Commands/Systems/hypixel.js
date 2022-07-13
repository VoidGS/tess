const { CommandInteraction, MessageEmbed } = require("discord.js");
const Hypixel = require("hypixel-api-reborn");
const hypixel = new Hypixel.Client("9cc30192-b6f7-43d8-8297-caffb415bbfc");

module.exports = {
    name: "hypixel",
    description: "Get the hypixel stats from a user.",
    options: [
        {
            name: "player",
            description: "Select the player.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "nickname",
                    description: "Select the player to see the info.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "stats",
            description: "Select the gamemode.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "gamemode",
                    description: "Select the gamemode.",
                    type: "STRING",
                    required: true,
                    choices: [
                        { name: "Bedwards", value: "bedwars" },
                        { name: "Build Battle", value: "buildbattle" }
                    ]
                },
                {
                    name: "nickname",
                    description: "Select the player to see the stats.",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { options, user } = interaction;
        const nickname = options.getString("nickname");

        let author = {
            name: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        let footer = {
            text: user.tag,
            iconURL: user.avatarURL({dynamic: true, size: 512})
        }

        switch (options.getSubcommand()) {
            case "player":
                hypixel.getPlayer(nickname).then(player => {
                    const successEmbed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setDescription(`**Nickname:** \`${player.nickname}\`
                                    
                                    **Hypixel Level:** \`${parseInt(player.level)}\`
                                    
                                    **Status:** \`${player.isOnline ? "🟢 Online" : "🔴 Offline"}\`
                                    
                                    **Last Login:** <t:${parseInt(player.lastLoginTimestamp / 1000)}:R>`)
                    .setAuthor(author)
                    .setThumbnail(`https://mc-heads.net/avatar/${player.uuid}`);
        
                    interaction.reply({embeds: [successEmbed]});
                }).catch(e => {
                    console.error(e);
                });
                break;
            
            case "stats":
                switch (options.getString("gamemode")) {
                    case "bedwars":
                        hypixel.getPlayer(nickname).then(player => {
                            const { bedwars } = player.stats;
                            const successEmbed = new MessageEmbed()
                            .setColor("BLURPLE")
                            .setDescription(`
                                            **💻 Player**
        
                                            **• Nickname:** \`${player.nickname}\`
                                            **• Bedwars Level:** \`${parseInt(bedwars.level)}\`
                                            **• Coins:** \`${bedwars.coins}\`
        
                                            **⭒☆━━━━━━━━━━━━━━━━━━━━━━━☆⭒**
                                            
                                            **📊 Stats**
        
                                            **• Played Games:** \`${bedwars.playedGames}\`
                                            **• Winstreak:** \`${bedwars.winstreak}\`
                                            **• Wins:** \`${bedwars.wins}\`
                                            **• Losses:** \`${bedwars.losses}\`
        
                                            **⭒☆━━━━━━━━━━━━━━━━━━━━━━━☆⭒**
                                            
                                            **⚔️ Combat**
        
                                            **• Final Kills:** \`${bedwars.finalKills}\`
                                            **• Kills:** \`${bedwars.kills}\`
                                            **• Final Deaths:** \`${bedwars.finalDeaths}\`
                                            **• Deaths:** \`${bedwars.deaths}\`
        
                                            **⭒☆━━━━━━━━━━━━━━━━━━━━━━━☆⭒**
                                            
                                            **🛏️ Beds**
        
                                            **• Beds Broken:** \`${bedwars.beds.broken}\`
                                            **• Beds Lost:** \`${bedwars.beds.lost}\`
        
                                            **⭒☆━━━━━━━━━━━━━━━━━━━━━━━☆⭒**
                                            
                                            **⚖️ Ratios**
        
                                            **• Win Rate:** \`${parseInt((bedwars.wins / bedwars.playedGames) * 100)}%\`
                                            **• Beds Rate:** \`${parseInt((bedwars.beds.broken / (bedwars.beds.broken + bedwars.beds.lost)) * 100)}%\`
                                            
                                            `)
                            .setFooter(footer)
                            .setThumbnail(`https://mc-heads.net/avatar/${player.uuid}`);
                
                            interaction.reply({embeds: [successEmbed]});
                        }).catch(e => {
                            console.error(e);
                        });        
                        break;

                    default:
                        interaction.reply("Work in progress.");
                        break;
                }
                break;
            
            default:
                break;
        }
    }
}