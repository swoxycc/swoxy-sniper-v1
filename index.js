const fetch = require('node-fetch');
const WebSocket = require('ws');
const colors = require('colors');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

colors.setTheme({
    'x1': ['grey', 'bold'],
    'r': ['red', 'bold'],
    'ss': ['green', 'italic'],
    'v': ['red', 'bold']
});

console.log('               discord = swoxycan');
console.log('------------------------------------------------');
console.log('DEVELOPER: swoxycan');
console.log(' ');
console.log('API: V9/V10');
console.log('------------------------------------------------');

class Sniper {
    constructor() {
        this.guilds = {};
        this.connectWebSocket();
    }

    connectWebSocket() {
        this.socket = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json&shard=0&shardcount=1');
        this.socket.on('open', () => {
            this.socket.send(JSON.stringify({
                'op': 2,
                'd': {
                    'token': config['yetkili_token'],
                    'intents': 0x201,
                    'properties': {
                        'os': 'macos',
                        'browser': 'Safari',
                        'device': 'MacBook Air'
                    }
                }
            }));
        });

        this.socket.on('close', () => {
            console.log('Bağlantı kapatıldı, yeniden bağlanıyor...'.r);
            this.connectWebSocket(); // Bağlantıyı tekrar başlat
        });

        this.socket.on('message', async message => {
            const data = JSON.parse(message);
            if (data.t === 'GUILD_UPDATE') this.handleGuildUpdate(data.d);
            else if (data.t === 'READY') this.handleReady(data.d);
            else if (data.t === 'GUILD_CREATE') this.handleGuildCreate(data.d);
            else if (data.t === 'GUILD_DELETE') this.handleGuildDelete(data.d);
        });

        this.socket.on('error', error => {
            console.error(error);
            process.exit(1);
        });
    }

    handleGuildUpdate(guild) {
        const oldGuild = this.guilds[guild.guild_id];
        if (oldGuild?.vanity_url_code && oldGuild.vanity_url_code !== guild.vanity_url_code) {
            this.snipeVanityURL(oldGuild.vanity_url_code, guild.guild_id);
        }
    }

    async snipeVanityURL(urlCode, guildId) {
        const startTime = Date.now();
        try {
            const response = await fetch(`https://canary.discord.com/api/v10/guilds/${config['sunucu_id']}/vanity-url`, {
                method: 'PATCH',
                body: JSON.stringify({ 'code': urlCode }),
                headers: {
                    'Authorization': config['yetkili_token'],
                    'Content-Type': 'application/json'
                }
            });

            const elapsedSeconds = (Date.now() - startTime) / 1000;

            if (response.ok) {
                console.log(`discord.gg/${urlCode} MS:${elapsedSeconds}. BAŞARILI.\nID: ${config['sunucu_id']}\n\nURL: ${urlCode}\n\n${elapsedSeconds}ms`.ss);
                const embed = {
                    'title': 'BAŞARILI',
                    'description': `ID: ${config['sunucu_id']}\n\nURL: ${urlCode}\n\n${elapsedSeconds}ms`,
                    'color': 0xff00
                };
                await this.sendWebhookRequest(config['webhook'], embed);
            } else {
                console.error(`F4IL = ${urlCode}`);
                const embed = {
                    'title': 'F4IL',
                    'description': `ID: ${config['sunucu_id']}\n\nURL: ${urlCode}\n\n${response.status}`,
                    'color': 0xff0000
                };
                await this.sendWebhookRequest(config['webhook'], embed);
            }
            delete this.guilds[guildId];
        } catch (error) {
            console.error(`Hata: Vanity HUNTER snipe işlemi sırasında bir hata oluştu: ${urlCode}`, error);
            delete this.guilds[guildId];
        }
    }

    handleReady(readyData) {
        readyData.guilds.filter(guild => typeof guild.vanity_url_code === 'string').forEach(guild => {
            this.guilds[guild.id] = {
                'vanity_url_code': guild.vanity_url_code,
                'boostCount': guild.premium_subscription_count
            };
            this.printGuildInfo(guild);
        });
        this.updateTitle();
        const embed = {
            'title': 'Can Sniper',
            'color': 0xff0000,
            'footer': {
                'icon_url': 'https://media.tenor.com/tK381P9wIoUAAAAi/yuno-shoot.gif'
            },
            'thumbnail': {
                'url': 'https://media.tenor.com/tK381P9wIoUAAAAi/yuno-shoot.gif'
            },
            'author': {
                'name': 'Swoxy Sniper V1'
            },
            'fields': [{
                'name': 'SWOXYCAN',
                'value': readyData.guilds.map(guild => guild.vanity_url_code).join(' '),
                'inline': true
            }, {
                'name': 'ID',
                'value': config['sunucu_id'],
                'inline': true
            }, {
                'name': 'C',
                'value': config['c'],
                'inline': true
            }],
            'image': {
                'url': 'https://media1.tenor.com/m/qigZamts4wAAAAAC/saber-anime.gif'
            }
        };
        this.sendWebhookRequest(config['webhook'], embed);
    }

    handleGuildCreate(guild) {
        this.guilds[guild.id] = {
            'vanity_url_code': guild.vanity_url_code
        };
        this.printGuildInfo(guild);
        this.updateTitle();
    }

    handleGuildDelete(guild) {
        const oldGuild = this.guilds[guild.id];
        if (oldGuild?.vanity_url_code) {
            this.snipeVanityURL(oldGuild.vanity_url_code, guild.id);
        }
    }

    updateTitle() {
        const guildCount = Object.keys(this.guilds).length;
        process.title = `swoxycxn - ${guildCount} URL SNIPLENDI`;
    }

    printGuildInfo(guild) {
        console.log(`>${'Server Vanity '.v}${guild.vanity_url_code.x1}| SUNUCU ID ${config['sunucu_id'].x1}| ISMI ${guild.name.x1}| BOOST ${guild.premium_subscription_count.x1}`);
    }

    async sendWebhookRequest(webhookUrl, embed) {
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            if (!response.ok) {
                console.error(`webhook error veriyor: ${response.status}`);
                const content = await response.text();
                console.error('Response content: ' + content);
            }
        } catch (error) {
            console.error('webhook hatalı:', error);
        }
    }
}

const sniper = new Sniper();
