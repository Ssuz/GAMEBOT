  
const Discord = require("discord.js")
const db = require('../../conn/mysql');
require('dotenv').config();
const prefix = process.env.PREFIX;
module.exports = {
    name: "0",
    aliases: [],
    category: "moderation",
    description: "Says your input via the bot",
    usage: "<input>",
    run: async (bot, message, args) => {
       message.channel.send("hello")

    }
}