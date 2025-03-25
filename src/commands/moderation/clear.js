const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { checkPermissions, checkBotPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'clear',
  description: 'Supprime un nombre spécifié de messages',
  usage: '<nombre>',
  category: 'moderation',
  async execute(message, args) {
    // Vérifier les permissions
    if (!checkPermissions(message, ['ManageMessages'])) return;
    if (!checkBotPermissions(message, ['ManageMessages'])) return;
    
    // Vérifier les arguments
    const amount = parseInt(args[0]);
    
    if (isNaN(amount) || amount <= 0 || amount > 100) {
      return message.reply({ 
        embeds: [errorEmbed('Veuillez spécifier un nombre entre 1 et 100.')] 
      });
    }
    
    try {
      // Supprimer les messages
      const deleted = await message.channel.bulkDelete(amount, true);
      
      // Envoyer un message de confirmation qui s'auto-détruit après 5 secondes
      const reply = await message.channel.send({ 
        embeds: [successEmbed(`${deleted.size} messages ont été supprimés.`)] 
      });
      
      setTimeout(() => {
        reply.delete().catch(() => {});
      }, 5000);
      
    } catch (error) {
      console.error(error);
      message.reply({ 
        embeds: [errorEmbed("Une erreur s'est produite lors de la suppression des messages. Vérifiez que les messages ne datent pas de plus de 14 jours.")] 
      });
    }
  }
};
