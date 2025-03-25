const { createEmbed } = require('../utils/embeds');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    // Canal de bienvenue (à personnaliser selon votre serveur)
    const welcomeChannel = member.guild.channels.cache.find(
      channel => channel.name === 'bienvenue' || channel.name === 'welcome'
    );
    
    if (!welcomeChannel) return;
    
    // Créer un message de bienvenue
    const embed = createEmbed({
      title: `Bienvenue sur ${member.guild.name} !`,
      description: `Heureux de te voir parmi nous, ${member} ! Tu es notre ${member.guild.memberCount}ème membre.`,
      thumbnail: member.user.displayAvatarURL({ dynamic: true }),
      footer: `ID: ${member.id}`
    });
    
    welcomeChannel.send({ embeds: [embed] });
  }
};
