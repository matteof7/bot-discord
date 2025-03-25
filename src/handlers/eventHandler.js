const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const eventsDir = path.join(__dirname, '..', 'events');
  const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsDir, file);
    const event = require(filePath);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    
    console.log(`Événement chargé: ${event.name}`);
  }
};
