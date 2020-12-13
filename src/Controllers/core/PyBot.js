const Generator =  require("./Generator.js");
const { exec } = require('child_process')

module.exports = class PYBot extends Generator {
 
    /**
     * @override
     * @param {object} env 
     */
    fetchData(bot) {
        return `
import discord

class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as ${bot.name}')
        print('- Version: ${bot.version} | Description: ${bot.description}')
    
client = MyClient()
client.run(${bot.token})
        `
    }
    
    /**
     * @override
     */
    installLibraries(directory){
        process.chdir(directory);
        exec(`pip install -U discord.py`);
    }
}