module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
      // Gestion des commandes slash (pour une future implémentation)
      if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        
        if (!command) return;
        
        try {
          await command.execute(interaction, client);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: 'Une erreur s\'est produite lors de l\'exécution de cette commande.',
            ephemeral: true
          });
        }
      }
      
      // Gestion des boutons
      if (interaction.isButton()) {
        // Code pour gérer les interactions avec les boutons
      }
      
      // Gestion des menus de sélection
      if (interaction.isSelectMenu()) {
        // Code pour gérer les interactions avec les menus de sélection
      }
    }
  };
  