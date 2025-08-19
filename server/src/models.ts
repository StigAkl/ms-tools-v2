export interface Player {
  id: string;
  username: string;
  rank: string | null;
  hits: number;
  gottenHit: number;
  dead: boolean;
  hitBy: string[];
}

export type Rank = "Gudfar" | "Capo Crimini" | "Capo de tutti Capi";

export const RANK_PRIORITY = [
  "Gudfar",
  "Capo Crimini",
  "Capo de tutti Capi",
] as const;
