// Depedencies
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const fs = require('fs').promises;

const ascii = require('./utils/ascii');


// Discor
const clearTerminal = () => {
    console.clear();
}


const menu = () => {
    clearTerminal();
    console.log(chalk.greenBright(ascii));
    getInfo();
}

const getInfo = () => {

    const botName = prompt(chalk.greenBright("[#] ~> Bot name: "));
    let botVersion = prompt("[#] ~> Bot version: (optional) ");
    let botDescription = prompt(chalk.greenBright("[#] ~> Bot description: (optional) "));
    const botToken = prompt("[#] ~> Bot token: ");

    if(botVersion.length <= 0) {
        botVersion = '1.0.0'
    } else if (botDescription.length <= 0) {
        botDescription = `${botName} made with Discor.`
    }
    createBotLocal(botName, botVersion, botDescription, botToken)
      .catch(console.error);
}


const createBotLocal = async (botName, botVersion, botDescription, botToken) => {

    const botDir = `${botName}Dir`;

    if(!(await fs.stat(botDir).catch(() => false))) {
        await fs.mkdir(botDir);
    }

    process.chdir(`./${botName}Dir`)
    return createBotFile(botName, botVersion, botDescription, botToken, botDir);
}


const createBotFile = async (botName, botVersion, botDescription, botToken, botDir) => {

    const botCode = `
    const Discord = require('discord.js');
    const dotenv = require('dotenv');

    dotenv.config();
    const client = new Discord.Client();
        
    client.on('ready', () => {
        console.log('- ${botName} online');
        console.log('- Version: ${botVersion} | Description: ${botDescription}');
    });
        
    client.on('message', msg => {
        if (msg.content === 'ping') {
            msg.reply('Pong!');
        }
    });
        
    client.login(process.env.TOKEN);
    `
    const env = 'TOKEN=' + botToken;
    
    await fs.writeFile('bot.js', botCode);
    await fs.writeFile('.env', env);
    console.log(chalk.greenBright("\n[!] ~> Bot created"));
    console.log(chalk.blueBright(`\nTo start your bot execute: \n- cd ${botDir}\n- node bot.js`))
}

menu();
