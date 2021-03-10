  
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
                                db.query(`SELECT * FROM users WHERE guildID = ${message.guild.id}`, async function(err, res) {
                                    if(err) console.log(err)
                                    const resguild = res.map(c=>c.guildID)
                                    const resdiscordid = res.map(c=>c.discordID)
                                    const guildname = bot.guilds.cache.get(`${resguild}`)
                                        console.log(`${message.author.tag}님의 정보 저장`);
                                        const succesembed = new Discord.MessageEmbed()
                                        .setTitle(`✅ |${message.author.tag}님의 초기설정 성공`)
                                        .setColor('#5EF900')
                                        .setDescription("```css\nGAMEBOT을 초기설정에 성공하였습니다\n[ !보이스설정, !게임설정 ]을 통해 다른 설정도 해주시길 바랍니다\n```")
                                        .addField("등록자" , `<@!${resdiscordid}>`)
                                        .addField("채널이름(채널ID)", "``" + `${guildname.name}(${resguild})` + "``")
                                        .setTimestamp()
                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL());
                                        await message.channel.send(succesembed);
                                });
                            }
                        });
                    } else {
                        const confirmsql = `SELECT * FROM users WHERE guildID = ${message.guild.id}`
                        
                        db.query(confirmsql, async function(err, res) {
                            if(err) console.log(err);
                            if(res.map(c=> c.guildID) == message.guild.id){
                                const resguild = res.map(c=>c.guildID)
                                const guild = bot.guilds.cache.get(`${resguild}`)
                                const errembed = new Discord.MessageEmbed()
                                .setTitle(`⛔ |${message.guild.name}채널의 정보가 존재합니다`)
                                .setColor('#E50D0D')
                                .setDescription("```css\n데이터가 존재합니다\n잠시후 이용해주시거나 [!설정초기화]를 입력해주세요\n```")
                                .addField("등록된유저", `<@!${res.map(c=>c.discordID)}>`, false)
                                .addField("채널이름(채널ID)" , "``"+ `${guild.name}(${resguild})` + "``" , false)
                                .addField("안내사항", "설정초기화에는 안내드린 ``등록된아이디 + 채널``이 필요합니다 \n더 궁금하신건 ``!문의`` 를통해 물어봐주세요")
                                .setTimestamp()
                                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL());
                                message.channel.send(errembed);
                            } else {
                                return
                            }
                        
                        });
                       
                    }
                });
            });
        })


    }
}