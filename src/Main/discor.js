// Depedencies
const prompt = require('prompt-sync')()
const fs = require('fs').promises
const { exec } = require('child_process')

const { green, blue, yellow, red } = require('../Views/design/color')
const ascii = require('../Views/design/ascii')


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

    const myBotName = prompt(green("\n[?] - Bot name ~> "));
    let myBotVersion = prompt("[?] - Bot version ~> (optional) ");
    let myBotDesc = prompt(green("[?] - Bot description ~> (optional) "));
    const myBotToken = prompt("[?] - Bot token ~> ");

    // Check version and token values
    myBotVersion.length <= 0 ? myBotVersion = '1.0.0' : myBotVersion;
    myBotToken.length <= 58 ? console.log(yellow("\nWARNING: Your TOKEN is invalid!")) : myBotToken;

    const myBot = new Bot(myBotName, myBotVersion, myBotDesc, myBotToken, myBotLanguage);
    createBotFolder(myBot);

}

const createBotFolder = async (myBot) => {

    const botFolder = `${myBot.botName}-dir`;

    if(!(await fs.stat(botFolder).catch(() => false))) {
        await fs.mkdir(botFolder);
    }

    process.chdir(`./${botFolder}`);

    createBotFile(myBot, botFolder);
}


const createBotFile = async (myBot, botFolder) => {

    const jsBot = require('../Controllers/core/JSBot')(myBot);
    const pyBot = require('../Controllers/core/PyBot')(myBot);

    const env = 'TOKEN=' + myBot.botToken;

    myBot.botLanguage === "JavaScript" ? await fs.writeFile('bot.js', jsBot)
                                       : await fs.writeFile('bot.py', pyBot)
    
    await fs.writeFile('.env', env);

    installLibraries(myBot, botFolder)

}

const installLibraries = async (myBot, botFolder) => {

    myBot.botLanguage === "JavaScript" ? exec("npm i discord.js")
                                       : exec("pip install -U discord.py");

    console.log(blue('\n[#] ~> Installing libraries...'))
    console.log(green("\n[!] ~> Setting up...\n"));
    console.log(blue(`To start your bot execute: \n- cd ${botFolder}\n- node bot.js\n`))

}


Menu();