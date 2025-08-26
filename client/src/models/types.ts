export interface User {
  name: string;
  rank: string;
}

export interface RankStatistics {
  gudfar: User[];
  capoCrimini: User[];
  tutti: User[];
}

export interface RouteData {
  route: string;
  payment: number;
  totalMinutes: number;
  paymentPerMinute: number;
}

export type Player = {
  id: string;
  username: string;
  rank: string | null;
  hits: number;
  gottenHit: number;
  dead: boolean;
  hitBy: string[];
  aliases: string[];
};
