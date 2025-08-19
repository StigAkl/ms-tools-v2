export const regex = {
  rankUp:
    /^(.+?) går opp i rank og er nå (Gudfar|Capo Crimini|Capo de tutti Capi)\.$/,
  killBotsPlural:
    /^(.+?) skyter og dreper (\d+) undersåtter eid av (.+?): (.+)\.$/,
  killBotsSingle:
    /^Undersåtten (.+?), som er eid av (.+?), blir skutt og drept av (.+)\.$/,
  killPlayer: /^(.+?) blir skutt og drept i (.+?)\.$/,
  diedToLowHealth: /^(.+?) dør pga for lav helse\.$/,
};
