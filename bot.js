const { Client, Intents } = require('discord.js');
const { ValorantAPI } = require('py-valorant-api');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

const valorant_api = new ValorantAPI({ api_key: '<votre_api_key>' });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'stats') {
    const username = options.getString('username');

    try {
      // Obtenir les statistiques du joueur
      const stats = await valorant_api.get_player_stats(username);

      // Créer un message avec les statistiques
      let message = `Statistiques pour ${username}:\n\n`;
      for (const mode in stats) {
        const mode_stats = stats[mode];
        message += `${mode}:\n`;
        message += `  Victoires: ${mode_stats.wins}\n`;
        message += `  Défaites: ${mode_stats.losses}\n`;
        message += `  Ratio de victoires: ${(mode_stats.win_rate * 100).toFixed(2)}%\n\n`;
      }

      // Envoyer le message au canal Discord
      interaction.reply(message);
    } catch (e) {
      // Si le nom d'utilisateur n'est pas valide, envoyer un message d'erreur
      interaction.reply(e.message);
    }
  }
});

client.login('<votre_token>');
