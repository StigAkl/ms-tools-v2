import { Player, Rank } from "./models";
import crypto from "crypto";
import { regex } from "./regexps";

const normalizeName = (s: string) => s.trim().toLowerCase();

const aliasIndex = new Map<string, string>();

export const analyzeEvent = (line: string, players: Map<string, Player>) => {
  const text = line.trim();
  if (!text) return;

  const rankUpMatch = text.match(regex.rankUp);

  if (rankUpMatch) {
    const [, name, newRank] = rankUpMatch || [];
    handleRankUpEvent(name, newRank as Rank, players);
    return;
  }

  const multipleBotsHitMatch = text.match(regex.killBotsPlural);

  if (multipleBotsHitMatch) {
    const [, name, amount, victim] = multipleBotsHitMatch || [];
    handleMultipleBotsKilled(name, parseInt(amount, 10), victim, players);
    return;
  }

  const singleBotHitMatch = text.match(regex.killBotsSingle);

  if (singleBotHitMatch) {
    const [, , victim, killer] = singleBotHitMatch || [];
    handleSingleBotKilled(killer, victim, players);
    return;
  }

  const playerDiedMatch = text.match(regex.diedToLowHealth);
  if (playerDiedMatch) {
    const [, name] = playerDiedMatch || [];
    handlePlayerDied(name, players);
    return;
  }

  const playerKilled = text.match(regex.killPlayer);
  if (playerKilled) {
    const [, name] = playerKilled || [];
    handlePlayerDied(name, players);
    return;
  }

  const nameChangeMatch = text.match(regex.changedName);

  if (nameChangeMatch) {
    const [_, from, to] = nameChangeMatch || [];
    handleNameChange(from, to, players);
  }
};

const handleRankUpEvent = (
  name: string,
  newRank: Rank,
  players: Map<string, Player>
) => {
  const player = getOrCreatePlayer(name, players);
  // Player already has a higher rank
  if (player.rank) return;
  player.rank = newRank as Rank;
};

const handleSingleBotKilled = (
  killerName: string,
  victim: string,
  players: Map<string, Player>
) => {
  const killerPlayer = getOrCreatePlayer(killerName, players);
  const victimPlayer = getOrCreatePlayer(victim, players);
  killerPlayer.hits += 1;
  victimPlayer.gottenHit += 1;
  victimPlayer.hitBy.push(killerName);
};

const handleNameChange = (
  from: string,
  to: string,
  players: Map<string, Player>
) => {};

const handleMultipleBotsKilled = (
  name: string,
  botsKilled: number,
  victim: string,
  player: Map<string, Player>
) => {
  const killerPlayer = getOrCreatePlayer(name, player);
  const victimPlayer = getOrCreatePlayer(victim, player);
  killerPlayer.hits += 1;
  victimPlayer.gottenHit += 1;
  victimPlayer.hitBy.push(name);
};

const handlePlayerDied = (name: string, players: Map<string, Player>) => {
  const player = getOrCreatePlayer(name, players);
  player.dead = true;
};

const getOrCreatePlayer = (name: string, players: Map<string, Player>) => {
  const player = players.get(normalizeName(name));
  if (player) {
    return player;
  }

  const newPlayer: Player = {
    id: idFromName(name),
    username: name.trim(),
    rank: null,
    hits: 0,
    gottenHit: 0,
    dead: false,
    hitBy: [],
    aliases: [],
  };

  players.set(normalizeName(name), newPlayer);
  return newPlayer;
};

const idFromName = (name: string) => {
  return crypto
    .createHash("md5")
    .update(name.trim().toLowerCase())
    .digest("hex");
};
