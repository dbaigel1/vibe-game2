export const GRID_SIZE = 12;

export type CardType = "money" | "move" | "soldier" | "upgrade";

export interface Card {
  id: string;
  type: CardType;
  value: number;
  description: string;
}

export interface ShopCard {
  type: CardType;
  cost: number;
  description: string;
}

export interface Unit {
  type: "miner" | "soldier";
  position: Position;
}

export interface Player {
  id: "player1" | "player2";
  deck: Card[];
  hand: Card[];
  discarded: Card[];
  money: number;
  base: {
    health: number;
    position: Position;
  };
  units: Unit[];
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  players: {
    player1: Player;
    player2: Player;
  };
  currentTurn: "player1" | "player2";
  selectedCards: Card[];
  selectedShopCard: ShopCard | null;
  selectedUnit: {
    position: Position;
    type: "miner" | "soldier";
  } | null;
  selectedMoveCards: Card[];
  shop: ShopCard[];
}
