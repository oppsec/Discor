// Depedencies
const prompt = require('prompt-sync')();
const fs = require('fs').promises;

const { green, blue, yellow, red } = require('./utils/code/color');
const ascii = require('./utils/code/ascii');
const { fstatSync } = require('fs');


class Bot {
    constructor(botName, botVersion, botDesc, botToken, botLanguage ) {
        this.botName = botName;
        this.botVersion = botVersion;
        this.botDesc = botDesc;
        this.botToken = botToken;
        this.botLanguage = botLanguage;
    }
}


const Menu = () => {
    console.clear();
    console.log(green(ascii));
    botInfo();
}


const botInfo = () => {

    console.log(green('[?] - Select the bot language: JavaScript or Python'))
    const myBotLanguage = prompt("[?] - Bot language ~> ");

    if(myBotLanguage !== "JavaScript" && myBotLanguage !== "Python") {
        return console.log(red("\n[!] - Invalid bot language selected"));
    }

    console.log('\n')

    const myBotName = prompt(green("[?] - Bot name ~> "));
    let myBotVersion = prompt("[?] - Bot version ~> (optional) ");
    let myBotDesc = prompt(green("[?] - Bot description ~> (optional) "));
    const myBotToken = prompt("[?] - Bot token ~> ");

    if(myBotVersion.length <= 0) {
        myBotVersion = '1.0.0';
    } 

    if(myBotToken.length <= 58) {
        console.log(yellow("\nWARNING: Your TOKEN is invalid"));
    }

    const myBot = new Bot(myBotName, myBotVersion, myBotDesc, myBotToken, myBotLanguage);
    createBotFolder(myBotName, myBot, myBotLanguage);

}

const createBotFolder = async (myBotName, myBot, myBotLanguage) => {

    const botFolder = `${myBotName}-dir`;

    if(!(await fs.stat(botFolder).catch(() => false))) {
        await fs.mkdir(botFolder);
    }

    process.chdir(`./${botFolder}`);

    createBotFile(myBot, botFolder, myBotLanguage);
}


const createBotFile = async (myBot, botFolder, myBotLanguage) => {

    const JSCode = require('./botCode/JSBot')(myBot);
    const PyCode = require('./botCode/PyBot')(myBot);

    const env = 'TOKEN=' + myBot.botToken;
    
    if(myBotLanguage === "JavaScript") {
        await fs.writeFile('bot.js', JSCode)
    } else {
        await fs.writeFile('bot.py', PyCode)
    }

    await fs.writeFile('.env', env);

    console.log(green("\n[!] ~> Bot created"));
    console.log(blue(`\nTo start your bot execute: \n- cd ${botFolder}\n- node bot.js`))

}


Menu();