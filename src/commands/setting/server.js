  
const Discord = require("discord.js")
const db = require('../../conn/mysql');
require('dotenv').config();
const prefix = process.env.PREFIX;
module.exports = {
    name: "서버설정",
    aliases: [],
    category: "SETTING",
    description: "Says your input via the bot",
    usage: "<input>",
    run: async (bot, message, args) => {
        await message.delete();
        const waitembed = new Discord.MessageEmbed()
        .setColor('#0172F4')
        .setTitle(`${message.author.tag}님의 서버설정`)
        .setDescription("```md\n# | 서버 초기설정을 불러오는중입니다 잠시만 기다려주세요.\n```")
        .setTimestamp()
        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL());
        await message.channel.send(waitembed).then((msg) => {
            msg.delete({ timeout: 4000 }).then(() => {
                const userID = message.author.id
                const guildID = message.guild.id
                const sql = `SELECT * FROM users WHERE discordID = ${userID};`
                db.query(sql, function(err, res) {
                    if(err) return console.log(err);
                    const data = res.map(c => c.discordID);
    
                    if(userID != data) {
                        const insersql = `INSERT INTO users(discordID,tag,guildID,gamemode,voicechannel) VALUES(?,?,?,?,?);`
                        db.query(insersql, [userID, message.author.tag, message.guild.id, 0 , 0], async function(err) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(`${message.author.tag}님의 정보 저장`);
                                const succesembed = new Discord.MessageEmbed()
                                .setTitle(`✅ |${message.author.tag}님의 초기설정 성공`)
                                .setColor('#5EF900')
                                .setDescription("```css\nGAMEBOT을 초기설정에 성공하였습니다\n[ !입장, !게임설정 ]을 통해 다른 설정도 해주시길 바랍니다\n```")
                                .setTimestamp()
                                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL());
                                await message.channel.send(succesembed);
                            }
                        });
                    } else {
                        const errembed = new Discord.MessageEmbed()
                        .setTitle(`⛔ |${message.author.tag}님의 정보가 존재합니다`)
                        .setColor('#E50D0D')
                        .setDescription("```css\n데이터가 존재합니다\n잠시후 이용해주시거나 [!설정초기화]를 입력해주세요\n```")
                        .setTimestamp()
                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL());
                        message.channel.send(errembed)
                    }
                });
            });
        })


    }
}