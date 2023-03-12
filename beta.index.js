const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const valorantApiKey = 'VOTRE_CLE_D_API_VALORANT_API_COM';

async function getPlayerStats(playerName, tagLine) {
  const url = `https://api.valorant-api.com/v1/mmr/${playerName}/${tagLine}`;
  const headers = {
    'Accept-Language': 'fr-FR',
    'X-Riot-Token': valorantApiKey
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getPlayerMatches(playerName, tagLine) {
  const url = `https://api.valorant-api.com/v1/matches/${playerName}/${tagLine}`;
  const headers = {
    'Accept-Language': 'fr-FR',
    'X-Riot-Token': valorantApiKey
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getPlayerRankedMatches(playerName, tagLine) {
  const url = `https://api.valorant-api.com/v1/mmrhistory/${playerName}/${tagLine}`;
  const headers = {
    'Accept-Language': 'fr-FR',
    'X-Riot-Token': valorantApiKey
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.content.startsWith('!stats ')) {
    const playerName = message.content.slice(7);
    const tagLine = '0000'; // Remplacez ceci par le tagline du joueur
    const stats = await getPlayerStats(playerName, tagLine);
    const matches = await getPlayerMatches(playerName, tagLine);
    const rankedMatches = await getPlayerRankedMatches(playerName, tagLine);

    if (stats && stats.currenttier) {
  const rank = stats.currenttier.toLowerCase().split('_').join(' ');
  const agentStats = stats.agentstats.map(agent => ({
    agentName: agent.agent.toLowerCase().split('_').join(' '),
    kills: agent.kills,
    deaths: agent.deaths,
    assists: agent.assists,
    kdratio: agent.kd,
    wins: agent.wins,
    losses: agent.losses,
    winratio: Math.round((agent.wins / (agent.wins + agent.losses)) * 100)
  }));
  const gameModeStats = stats.queuestats.map(gameMode => ({
    gameModeName: gameMode.queueId,
    wins: gameMode.wins,
    losses: gameMode.losses,
    winratio: Math.round((gameMode.wins / (gameMode.wins + gameMode.losses)) * 100)
  }));
  const rankedStats = {
    rating: stats.currenttier.toLowerCase().split('_')[1],
    winStreak: rankedMatches.winStreak,
    games: rankedMatches.matches.length,
    wins: rankedMatches.matches.filter(match => match.RankedRatingAfterUpdate > match.RankedRatingBeforeUpdate).length,
    losses: rankedMatches.matches.filter(match => match.RankedRatingAfterUpdate < match.RankedRatingBeforeUpdate).length,
    winratio: Math.round((rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100)
  };
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Stats pour ${playerName}`)
    .setDescription(`Rank: ${rank}`)
    .addField('Agent Stats', agentStats.map(agent => `${agent.agentName}: K/D Ratio: ${agent.kdratio.toFixed(2)}, Win Ratio: ${agent.winratio}%`).join('\n'), true)
    .addField('Game Mode Stats', gameModeStats.map(gameMode => `${gameMode.gameModeName}: Win Ratio: ${gameMode.winratio}%`).join('\n'), true)
    .addField('Ranked Stats', `Rating: ${rankedStats.rating}, Win Streak: ${rankedStats.winStreak}, Games Played: ${rankedStats.games}, Win Ratio: ${rankedStats.winratio}%`);

  message.channel.send(embed);
} else {
  message.channel.send(`Impossible de récupérer les statistiques pour ${playerName}.`);
  }
 }
});

client.login('VOTRE_TOKEN_BOT_DISCORD');
