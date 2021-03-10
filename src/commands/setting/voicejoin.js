  
const Discord = require("discord.js")
const db = require('../../conn/mysql');
require('dotenv').config();
const prefix = process.env.PREFIX;

module.exports = {
    name: "보이스설정",
    aliases: [],
    category: "SETTING",
    description: "Says your input via the bot",
    usage: "<input>",
    run: async (bot, message, args) => {

    }
}