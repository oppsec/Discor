const fs  = require('fs').promises;
const path = require('path');


/**
 * @abstract
 */
module.exports =  class Generator {
    constructor() {
        if (this.constructor === Generator) {
            throw new TypeError('Abstract class "Generator" cannot be instantiated directly.'); 
        }
    }
    
    async generate(bot, fileSystem) {
        return await this.createBotFolder(bot, fileSystem);
    }

    /**
     * @param {object} bot 
     * @returns {object}
     */
    async createBotFolder (bot,fileSystem) {
        const directory = path.resolve(fileSystem.directory);

        if(!(await fs.stat(directory).catch(() => false))) {
            await fs.mkdir(directory);
        }

        const file = await this.createBotFile(
            bot, 
            fileSystem,
            path.resolve(directory,'.env')
        );

        return file;
    }


    /**
     * @param {object} bot 
     * @param {string} filename 
     */
    async createBotFile (bot, fileSystemBOT, envDir = undefined) {
        const env = 'TOKEN=' + bot.token;
        console.log(fileSystemBOT);
        await fs.writeFile(path.resolve(fileSystemBOT.path), this.fetchData(bot))
        await fs.writeFile(envDir || path.resolve(fileSystemBOT.directory,'.env'), env);
    
        this.installLibraries(path.resolve(fileSystemBOT.directory));
    
        return fileSystemBOT.path;
    }

    /**
     * @abstract
     * @param {object} bot 
     */
    fetchData(bot) {} // Abstract method 

    /**
     * @abstract
     * @param string directory 
     */
    installLibraries(directory) {} // Abstract method 
}