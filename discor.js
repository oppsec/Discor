// Depedencies
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const fs = require('fs');

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
        createBotLocal(botName, botVersion, botDescription, botToken);
    } else if (botDescription.length <= 0) {
        botDescription = `${botName} made with Discor.`
        createBotLocal(botName, botVersion, botDescription, botToken);
    } else {
        createBotLocal(botName, botVersion, botDescription, botToken);
    }

}


const createBotLocal = (botName, botVersion, botDescription, botToken) => {

    const botDir = `${botName}Dir`;

    if(!fs.existsSync(botDir)) {
        fs.mkdirSync(botDir)
    }

    process.chdir(`./${botName}Dir`)
    createBotFile(botName, botVersion, botDescription, botToken, botDir);
}


const createBotFile = (botName, botVersion, botDescription, botToken, botDir) => {

    const botCode = `
    const Discord = require('discord.js');
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
        
    client.login('${botToken}');
    `

    fs.writeFile('bot.js', botCode, function(err) {
        if(err) throw err;
        console.log(chalk.greenBright("\n[!] ~> Bot created"));
        console.log(chalk.blueBright(`\nTo start your bot execute: \n- cd ${botDir}\n- node bot.js`))
    });
}

menu();