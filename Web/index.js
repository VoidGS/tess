const { Client } = require('discord.js');
const fs = require('fs');
const express = require('express');
const path = require('path');
const axios = require("axios");

const colors = {
    white: '#ffffff',
    primary: '#3699FF',
    primary: '#5865f2',
    secondary: '#E4E6EF',
    success: '#50CD89',
    info: '#7239EA',
    warning: '#FFC700',
    danger: '#F1416C',
    dark: '#181C32',
};
   
const nearestHumanColor = require('nearest-color').from(colors);

const app = express();
const port = 3000;

module.exports = client => {
    
    app.get('/', function(req, res) {
        // res.render('home', { title: 'Hey', message: 'Tess here!'});
        res.render('home', {
            'dados': {
                'pageName': 'Home',
                'title': 'Home',
                'desc': 'Clique em um usuário para ver o seu perfil.'
            }
        });
    });
    
    app.get('/profile/:id', async function(req, res) {
        res.render('profile', {
            'dados': {
                'pageName': 'Profile',
                'title': 'Profile',
                'desc': 'Veja informações do usuário!'
            },
            'loop': {
                'members': {
                    'construct': getHTML(),
                    'data': {
                        ...await getMembers(client)
                    },
                    'fail': '<h1>Nenhum membro encontrado :(</h1>'
                }
            }
        });
        console.log(req.params.id);
    });
    
    app.listen(port, function() {
        console.log(`App de Exemplo escutando na porta ${port}!`);
    });
    
    app.engine('html', function (filePath, options, callback) {
        var dados = options.dados;
        var loop = options.loop;
    
        const search = '#includePath#';
        const replacer = new RegExp(search, 'g');
        let includePath = path.resolve("./Web/Includes/");
    
        var header = fs.readFileSync(includePath + "/header.html").toString().replace(replacer, includePath);
        var footer = fs.readFileSync(includePath + "/footer.html").toString().replace(replacer, includePath);
    
        fs.readFile(filePath, function(err, content) {
            var body = content.toString().replace("#content#", "");

            if (typeof loop === 'object') {
                for (const key in loop) {
                    if (Object.hasOwnProperty.call(loop, key)) {
                        const element = loop[key];

                        let construct = element['construct'];
                        let data = element['data'];
                        let fail = element['fail'];

                        if (Object.keys(data).length > 0) {
                            for (const key2 in data) {
                                if (Object.hasOwnProperty.call(data, key2)) {
                                    const element2 = data[key2];
                                    let userConstruct = construct;

                                    for (const key3 in element2) {
                                        if (Object.hasOwnProperty.call(element2, key3)) {
                                            const element3 = element2[key3];
                                            
                                            // console.log("Key: " + key3);
                                            // console.log("Value: " + element3);
        
                                            userConstruct = userConstruct.replace('#' + key3 + '#', element3);
                                        }
                                    }
                                    
                                    body = body + userConstruct;
                                }
                            }
                        } else {
                            body = body + fail;
                        }

                    }
                }
            }

            var rendered = (header + content.toString().replace('#content#', body) + footer);

            if (typeof dados === 'object') {
                for (const key in dados) {
                    if (Object.hasOwnProperty.call(dados, key)) {
                        const val = dados[key];
                        rendered = rendered.replace('#' + key + '#', val);
                    }
                }
            }
        
            return callback(null, rendered);
        });
    
    });
    
    app.set('views', __dirname + "/Views");
    app.set('view engine', 'html');
    app.use(express.static(__dirname + "/Includes"));
}

/**
 * @param {Client} client
 */
async function getMembers(client) {
    var members = {};

    client.guilds.cache.forEach((guild) => {
        guild.members.cache.forEach((member) => {
            if (!(member.id in members)) {
                members[member.id] = {
                    id: member.id,
                    name: member.user.username,
                    nickname: member.nickname ? member.nickname : "Pobre",
                    avatarURL: member.user.avatarURL({dynamic: true, size: 512}),
                    roleColor: nearestHumanColor(member.roles.highest.hexColor).name,
                    roleName: member.roles.highest.name
                };

                console.log(nearestHumanColor(member.roles.highest.hexColor));
            }
        })
    });

    for (const key in members) {
        if (Object.hasOwnProperty.call(members, key)) {
            members[key]['bannerURL'] = await getUserBannerUrl(key, client);
        }
    }

    return members;
}

/**
 * @param {Client} client
 */
 async function getUserBannerUrl(userId, client, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {
    if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
        throw new Error(`The size '${size}' is not supported!`);
    }

    if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
        throw new Error(`The format '${defaultFormat}' is not supported as a default format!`);
    }

    const user = await client.api.users(userId).get();
    if (!user.banner) return "https://st.depositphotos.com/1854227/1535/i/600/depositphotos_15356143-stock-photo-homeless.jpg";

    const query = `?size=${size}`;
    const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;

    if (dynamicFormat) {
        const { headers } = await axios.head(baseUrl);
        if (headers && headers.hasOwnProperty("content-type")) {
            return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
        }
    }

    return baseUrl + `.${defaultFormat}` + query;

}

function getHTML() {
    return `<div class="card mb-5 mb-xl-10" id="#id#">
    <div class="card-body pt-9 pb-0">
        <!--begin::Details-->
        <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
            <!--begin: Pic-->
            <div class="me-7 mb-4">
                <div class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                    <img src="#avatarURL#" alt="image">
                    <div class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
                </div>
            </div>
            <!--end::Pic-->
            <!--begin::Info-->
            <div class="flex-grow-1">
                <!--begin::Title-->
                <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
                    <!--begin::User-->
                    <div class="d-flex flex-column">
                        <!--begin::Name-->
                        <div class="d-flex align-items-center mb-2">
                            <a href="#" class="text-gray-900 text-hover-primary fs-2 fw-bolder me-1">#name#</a>
                            <a href="#">
                                <!--begin::Svg Icon | path: icons/duotune/general/gen026.svg-->
                                <span class="svg-icon svg-icon-1 svg-icon-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                        <path d="M10.0813 3.7242C10.8849 2.16438 13.1151 2.16438 13.9187 3.7242V3.7242C14.4016 4.66147 15.4909 5.1127 16.4951 4.79139V4.79139C18.1663 4.25668 19.7433 5.83365 19.2086 7.50485V7.50485C18.8873 8.50905 19.3385 9.59842 20.2758 10.0813V10.0813C21.8356 10.8849 21.8356 13.1151 20.2758 13.9187V13.9187C19.3385 14.4016 18.8873 15.491 19.2086 16.4951V16.4951C19.7433 18.1663 18.1663 19.7433 16.4951 19.2086V19.2086C15.491 18.8873 14.4016 19.3385 13.9187 20.2758V20.2758C13.1151 21.8356 10.8849 21.8356 10.0813 20.2758V20.2758C9.59842 19.3385 8.50905 18.8873 7.50485 19.2086V19.2086C5.83365 19.7433 4.25668 18.1663 4.79139 16.4951V16.4951C5.1127 15.491 4.66147 14.4016 3.7242 13.9187V13.9187C2.16438 13.1151 2.16438 10.8849 3.7242 10.0813V10.0813C4.66147 9.59842 5.1127 8.50905 4.79139 7.50485V7.50485C4.25668 5.83365 5.83365 4.25668 7.50485 4.79139V4.79139C8.50905 5.1127 9.59842 4.66147 10.0813 3.7242V3.7242Z" fill="#00A3FF"></path>
                                        <path class="permanent" d="M14.8563 9.1903C15.0606 8.94984 15.3771 8.9385 15.6175 9.14289C15.858 9.34728 15.8229 9.66433 15.6185 9.9048L11.863 14.6558C11.6554 14.9001 11.2876 14.9258 11.048 14.7128L8.47656 12.4271C8.24068 12.2174 8.21944 11.8563 8.42911 11.6204C8.63877 11.3845 8.99996 11.3633 9.23583 11.5729L11.3706 13.4705L14.8563 9.1903Z" fill="white"></path>
                                    </svg>
                                </span>
                                <!--end::Svg Icon-->
                            </a>
                        </div>
                        <!--end::Name-->
                        <!--begin::Info-->
                        <div class="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                            <a href="#" class="d-flex align-items-center text-gray-400 me-2 mb-2">
                                <span class="svg-icon svg-icon-3 me-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path opacity="0.3" d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12ZM12 7C10.3 7 9 8.3 9 10C9 11.7 10.3 13 12 13C13.7 13 15 11.7 15 10C15 8.3 13.7 7 12 7Z" fill="currentColor"></path>
                                        <path d="M12 22C14.6 22 17 21 18.7 19.4C17.9 16.9 15.2 15 12 15C8.8 15 6.09999 16.9 5.29999 19.4C6.99999 21 9.4 22 12 22Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                #nickname#
                            </a>
                            <a href="#" class="d-flex align-items-center text-gray-400 me-2 mb-2">
                                ♡ 
                            </a>
                            <a href="#" class="d-flex align-items-center text-gray-400 me-5 mb-2">
                                <span class="badge badge-light-#roleColor# badge-lg">#roleName#</span>
                            </a>
                        </div>
                        <!--end::Info-->
                    </div>
                    <!--end::User-->
                </div>
                <!--end::Title-->
                <!--begin::Stats-->
                <div class="d-flex flex-wrap flex-stack">
                    <!--begin::Wrapper-->
                    <div class="d-flex flex-column flex-grow-1 pe-8">
                        <!--begin::Stats-->
                        <div class="d-flex flex-wrap">
                            <!--begin::Stat-->
                            <div class="rounded min-w-200px min-h-75px py-3 px-4 me-6 mb-3" style="background-image: url('#bannerURL#'); background-position: center; background-repeat: no-repeat; background-size: cover;">
                                
                            </div>
                            <!--end::Stat-->
                        </div>
                        <!--end::Stats-->
                    </div>
                    <!--end::Wrapper-->
                </div>
                <!--end::Stats-->
            </div>
            <!--end::Info-->
        </div>
        <!--end::Details-->
    </div>
</div>`
}