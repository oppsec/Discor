// Depedencies
const prompt = require('prompt-sync')()
const fs = require('fs').promises
const path = require('path')

const { green, blue, yellow, red } = require('../Views/design/color')
const ascii = require('../Views/design/ascii')
const JSBot = require('../Controllers/core/JSBot')
const PYBot = require('../Controllers/core/PyBot')


class Bot {
    constructor(name, version, description, token, language, fileSystem ) {
        this.name = name;
        this.version = version;
        this.description = description;
        this.token = token;
        this.language = language;
        this.fileSystem = fileSystem;
    }
}

const language = {
    javascript: {
        ext: 'js',
        generator: JSBot
    },
    python : {
        ext: 'py',
        generator: PYBot
    }
}


const Menu = () => {
    console.clear();
    console.log(green(ascii));
    checkVersion()
}


const checkVersion = async () => {
    try {

        
        const currentVersion = await fs.readFile(path.resolve(__dirname, '.version'), 'utf-8', () => {})
        const packageFile = await fs.readFile(path.resolve(__dirname,'..','..','package.json'), 'utf-8', () => {})
        const packageVersion = JSON.parse(packageFile)
    
        packageVersion.version !=  currentVersion ? console.log(red('[X] - Your Discor is outdated, consider updating.\n'))
                                                  : console.log(green('[!] - Updated\n')); setTimeout(botInfo, 2000)
    } catch (error) {
        console.log(red(error))
    }
}


const botInfo = async () => {

    console.log(green('[?] - Select the bot language: JavaScript or Python'))
    const botLanguage = prompt("[?] - Bot language ~> ").trim().toLowerCase();

    if(language[botLanguage] === undefined) {
        return console.log(red("\n[!] - Invalid bot language selected"));
    }

    const name = prompt(green("\n[?] - Bot name ~> ")).trim();
    let version = prompt("[?] - Bot version ~> (optional) ") || '1.0.0'.trim();
    const description = prompt(green("[?] - Bot description ~> (optional) ")).trim();
    const token = prompt("[?] - Bot token ~> ").trim();

    // Check version and token values
    token.length <= 58 ? console.log(yellow("\nWARNING: Your TOKEN is invalid!")) : token;
    
    const fileSystem = {
        filename: `bot.${language[botLanguage].ext}`,
        directory: name,
        path: path.resolve(`${name}-dir`,`bot.${language[botLanguage].ext}`)
    }

    try{
        const bot = new Bot(name, version, description, token, botLanguage);
        const generator = new language[botLanguage].generator();

        await generator.generate(bot,fileSystem);
        
        console.log(blue('\n[#] ~> Installing libraries...'))
        console.log(green("\n[!] ~> Setting up...\n"));
        console.log(blue(`To start your bot execute: \n- cd ${fileSystem.directory}\n- node bot.js\n`))
    } catch (e){
        console.log(red(e));
    }
}


Menu();