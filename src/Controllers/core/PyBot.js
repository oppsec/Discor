module.exports = function createPyBot(myBot) 
{
    return `
import discord

class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as ${myBot.botName}')
        print('- Version: ${myBot.botVersion} | Description: ${myBot.botDesc}')
    
client = MyClient()
client.run(${myBot.botToken})
`
}