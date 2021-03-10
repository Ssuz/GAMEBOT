require('dotenv').config();
const { Client, Collection } = require('discord.js');
const bot = new Client();
const db = require('./conn/mysql');

bot.commands = new Collection();
bot.aliases = new Collection();

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});

db.connect((err) => {
    if (err) {
        console.log(err);
    }else{
        console.log('DB Connected...');
    }
});


bot.on('ready', () => {
    console.log(`Bot is Ready`);
    bot.user.setStatus('idle');
    bot.user.setActivity('!help', {type:'WATCHING'});
});

bot.on('guildMemberAdd', async member => {
    const sql = `SELECT * FROM users WHERE discordID = ${member.id};`
    db.query(sql, function(err, result) {
        if(err) return console.log(err);
        const data = result.map(c => c.discordID);
        
        if(member.id != data) {
            db.query('INSERT INTO users(discordID, tag, warn, admin) VALUES (?,?,?,?)',[member.id, member.user.tag, 0 ,0 ], function(err) {
                if(err){ 
                    return console.log(err)
                } else {
                    console.log(`${member.user.tag} 님의 정보 저장`);
                }
            });
        } else {
            console.log('이미 존재하는 아이디');
        }

        
    });
});

bot.on('guildMemberRemove', async member => {
    await db.query(`DELETE FROM users WHERE discordID = ${member.id}`, function(err) {
        if(err) { 
            console.log(err)
        } else {
            console.log(`${member.user.tag}님의 정보 삭제`);
        }
    });
});

bot.on('guildMemberUpdate', (oldMember, newMember) => {
    if(oldMember.displayName != newMember.displayName){
        const sql = `UPDATE users SET tag='${newMember.displayName}#${newMember.user.discriminator}' WHERE tag='${oldMember.displayName}#${oldMember.user.discriminator}';`
        db.query(sql, function(err, result) {
            if(err) return console.log(err)
            return console.log('유저 닉네임 변경');
        });
    } else {
        return
    }
});

bot.on("message", async message => {
    const prefix = process.env.PREFIX;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));

    if (command) 
    command.run(bot, message, args);
    

});

bot.login(process.env.BOT_TOKEN);