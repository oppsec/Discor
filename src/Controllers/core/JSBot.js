const Generator = require("./Generator.js");
const { exec } = require('child_process')

module.exports = class JSBot extends Generator {
 
    /**
     * @override
     * @param {object} bot 
     */
    fetchData(bot) {
            return `
const Discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
const client = new Discord.Client();
        
client.on('ready', () => {
    console.log('- ${bot.name} online');
    console.log('- Version: ${bot.version} | Description: ${bot.description}');
});
        
client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});
        
client.login(process.env.TOKEN);
`;
    }

    /**
     * @override
     */
    installLibraries(directory){
        process.chdir(directory);
        exec(`npm i discord.js`);
    }
}