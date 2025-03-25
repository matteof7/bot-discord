const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandsDir = path.join(__dirname, '..', 'commands');
  const commandFolders = fs.readdirSync(commandsDir);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsDir, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      
      if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
        console.log(`Commande chargée: ${command.name}`);
      } else {
        console.log(`[AVERTISSEMENT] La commande ${file} manque de propriétés requises.`);
      }
    }
  }
};
