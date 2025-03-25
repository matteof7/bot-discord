const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { checkPermissions, checkBotPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'ban',
  description: 'Bannit un membre du serveur',
  usage: '<@utilisateur> [raison]',
  category: 'moderation',
  async execute(message, args) {
    // Vérifier les permissions
    if (!checkPermissions(message, ['BanMembers'])) return;
    if (!checkBotPermissions(message, ['BanMembers'])) return;
    
    // Vérifier si un utilisateur a été mentionné
    if (!args.length) {
      return message.reply({ 
        embeds: [errorEmbed('Veuillez mentionner un utilisateur à bannir.')] 
      });
    }
    
    // Récupérer l'utilisateur mentionné
    const target = message.mentions.members.first() || 
                   await message.guild.members.fetch(args[0]).catch(() => null);
    
    if (!target) {
      return message.reply({ 
        embeds: [errorEmbed('Utilisateur introuvable.')] 
      });
    }
    
    // Vérifier si l'utilisateur peut être banni
    if (!target.bannable) {
      return message.reply({ 
        embeds: [errorEmbed('Je ne peux pas bannir cet utilisateur. Il a peut-être un rôle supérieur au mien.')] 
      });
    }
    
    // Vérifier si l'utilisateur qui exécute la commande n'essaie pas de bannir quelqu'un avec un rôle supérieur
    if (message.member.roles.highest.position <= target.roles.highest.position && message.guild.ownerId !== message.author.id) {
      return message.reply({ 
        embeds: [errorEmbed('Vous ne pouvez pas bannir un membre avec un rôle égal ou supérieur au vôtre.')] 
      });
    }
    
    // Récupérer la raison du bannissement
    const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';
    
    try {
      // Envoyer un message à l'utilisateur avant de le bannir (si possible)
      try {
        await target.send({
          embeds: [
            errorEmbed(`Vous avez été banni de **${message.guild.name}**.\nRaison: ${reason}`)
          ]
        });
      } catch (err) {
        // Si le message ne peut pas être envoyé, on continue quand même
        console.log(`Impossible d'envoyer un message à ${target.user.tag}`);
      }
      
      // Bannir l'utilisateur
      await target.ban({ 
        reason: `${message.author.tag}: ${reason}`,
        deleteMessageDays: 1 // Supprime les messages des dernières 24h
      });
      
      // Log du bannissement
      const banEmbed = successEmbed(`**${target.user.tag}** a été banni du serveur.`)
        .addFields(
          { name: 'ID', value: target.user.id },
          { name: 'Raison', value: reason },
          { name: 'Banni par', value: message.author.tag }
        );
      
      // Envoyer le message de confirmation
      message.reply({ embeds: [banEmbed] });
      
      // Envoyer le log dans un canal spécifique (si configuré)
      const logChannel = message.guild.channels.cache.find(
        channel => channel.name === 'mod-logs' || channel.name === 'logs'
      );
      
      if (logChannel && logChannel.permissionsFor(message.guild.members.me).has('SendMessages')) {
        logChannel.send({ embeds: [banEmbed] });
      }
      
    } catch (error) {
      console.error(error);
      message.reply({ 
        embeds: [errorEmbed(`Une erreur s'est produite lors du bannissement: ${error.message}`)] 
      });
    }
  }
};
