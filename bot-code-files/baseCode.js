module.exports = function createBaseCode(myBot) 
{
    return `
const Discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
const client = new Discord.Client();
        
client.on('ready', () => {
    console.log('- ${myBot.botName} online');
    console.log('- Version: ${myBot.botVersion} | Description: ${myBot.botDesc}');
});
        
client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});
        
client.login(process.env.TOKEN);
`;
}