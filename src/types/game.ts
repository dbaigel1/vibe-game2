export const GRID_SIZE = 12;

export type CardType = "money" | "move" | "soldier" | "upgrade";

export interface Card {
  id: string;
  type: CardType;
  value: number;
}

export interface ShopCard {
  type: CardType;
  cost: number;
  description: string;
}

export interface Unit {
  id: string;
  type: "soldier" | "miner";
  position: {
    x: number;
    y: number;
  };
  owner: "player1" | "player2";
}

export interface Player {
  id: "player1" | "player2";
  deck: Card[];
  hand: Card[];
  discarded: Card[];
  money: number;
  base: {
    health: number;
    position: {
      x: number;
      y: number;
    };
  };
}

export interface GameState {
  players: {
    player1: Player;
    player2: Player;
  };
  board: Unit[];
  currentTurn: "player1" | "player2";
  shop: ShopCard[];
  selectedCards: Card[];
  selectedShopCard: ShopCard | null;
}
