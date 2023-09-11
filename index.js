const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = 'YOUR_BOT_TOKEN'; // Remplacez par le token de votre bot
const TRACKERGG_API_KEY = 'YOUR_TRACKERGG_API_KEY'; // Remplacez par votre clé API Tracker.gg

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'stats') {
    const username = options.getString('username');

    try {
      // Appel à l'API Tracker.gg pour obtenir les statistiques du joueur Valorant
      const response = await axios.get(`https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${username}`, {
        headers: {
          'TRN-Api-Key': TRACKERGG_API_KEY,
        },
      });

      const playerData = response.data.data;
      if (!playerData) {
        await interaction.reply('Joueur introuvable.');
      } else {
        const stats = playerData.stats;
        const statsMessage = `Statistiques Valorant pour ${username} :
        - Level : ${stats.level.displayValue}
        - K/D Ratio : ${stats.kd.displayValue}
        - Victoires : ${stats.wins.displayValue}
        - Matchs joués : ${stats.matches.displayValue}`;

        await interaction.reply(statsMessage);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Une erreur s\'est produite lors de la récupération des statistiques Valorant.');
    }
  }
});

client.login(TOKEN);
