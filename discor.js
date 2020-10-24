// Depedencies
const prompt = require('prompt-sync')();
const fs = require('fs').promises;

const { green, blue, yellow } = require('./utils/color');
const ascii = require('./utils/ascii');


class Bot {
    constructor(botName, botVersion, botDesc, botToken ) {
        this.botName = botName;
        this.botVersion = botVersion;
        this.botDesc = botDesc;
        this.botToken = botToken;
    }
}


const Menu = () => {
    console.clear();
    console.log(green(ascii));
    botInfo();
}


const botInfo = () => {

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

    const myBot = new Bot(myBotName, myBotVersion, myBotDesc, myBotToken);
    createBotFolder(myBotName, myBot);

}

const createBotFolder = async (myBotName, myBot) => {

    const botFolder = `my-creations/${myBotName}-dir`;

    if(!(await fs.stat(botFolder).catch(() => false))) {
        await fs.mkdir(botFolder);
    }

    process.chdir(`./${botFolder}`);

    createBotFile(myBot, botFolder);
}


const createBotFile = async (myBot, botFolder) => {

    const botCodeFile = require('./bot-code-files/baseCode')(myBot);

    const env = 'TOKEN=' + myBot.botToken;
    
    await fs.writeFile('bot.js', botCodeFile);
    await fs.writeFile('.env', env);

    console.log(green("\n[!] ~> Bot created"));
    console.log(blue(`\nTo start your bot execute: \n- cd ${botFolder}\n- node bot.js`))

}


Menu();