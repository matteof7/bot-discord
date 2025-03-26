const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;

// Fonction pour se connecter à MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connecté à la base de données MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

// Fonctions pour gérer les avertissements
async function addWarning(guildId, userId, moderatorId, reason) {
  const Warning = require('../models/Warning');
  
  const warning = new Warning({
    guildId,
    userId,
    moderatorId,
    reason
  });
  
  await warning.save();
  return warning;
}

async function removeWarning(warningId) {
  const Warning = require('../models/Warning');
  
  const warning = await Warning.findByIdAndDelete(warningId);
  return warning;
}

async function getWarnings(guildId, userId) {
  const Warning = require('../models/Warning');
  
  const warnings = await Warning.find({ guildId, userId })
    .sort({ timestamp: 1 })
    .lean();
  
  return warnings;
}

async function countWarnings(guildId, userId) {
  const Warning = require('../models/Warning');
  
  const count = await Warning.countDocuments({ guildId, userId });
  return count;
}

module.exports = {
  connectToDatabase,
  addWarning,
  removeWarning,
  getWarnings,
  countWarnings
};
