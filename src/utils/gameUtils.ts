import {
  GameState,
  Card,
  Unit,
  GRID_SIZE,
  Player,
  ShopCard,
  CardType,
} from "../types/game";

const createCard = (
  type: "money" | "move" | "soldier" | "upgrade",
  value: number
): Card => ({
  id: `${type}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  value,
});

const createShopCard = (
  type: CardType,
  cost: number,
  description: string
): ShopCard => ({
  type,
  cost,
  description,
});

const SHOP_CARDS: ShopCard[] = [
  createShopCard("move", 1, "Move a unit one space"),
  createShopCard("soldier", 3, "Add a new soldier unit"),
  createShopCard("upgrade", 2, "Upgrade a unit's stats"),
];

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createInitialDeck = (): Card[] => {
  const deck: Card[] = [];
  // Add 5 money cards
  for (let i = 0; i < 5; i++) {
    deck.push(createCard("money", 1));
  }
  // Add 5 move cards
  for (let i = 0; i < 5; i++) {
    deck.push(createCard("move", 1));
  }
  return shuffleArray(deck);
};

const createInitialUnits = (): Unit[] => {
  return [
    {
      id: "soldier-1",
      type: "soldier",
      position: { x: 1, y: 5 },
      owner: "player1",
    },
    {
      id: "miner-1",
      type: "miner",
      position: { x: 2, y: 5 },
      owner: "player1",
    },
    {
      id: "soldier-2",
      type: "soldier",
      position: { x: 10, y: 6 },
      owner: "player2",
    },
    {
      id: "miner-2",
      type: "miner",
      position: { x: 9, y: 6 },
      owner: "player2",
    },
  ];
};

const drawCards = (
  deck: Card[],
  amount: number
): { drawnCards: Card[]; remainingDeck: Card[] } => {
  const drawnCards = deck.slice(0, amount);
  const remainingDeck = deck.slice(amount);
  return { drawnCards, remainingDeck };
};

const recycleDeck = (player: Player): Player => {
  // Combine discarded cards with current deck
  const allCards = [...player.discarded, ...player.deck];
  // Shuffle all cards
  const shuffledDeck = shuffleArray(allCards);

  return {
    ...player,
    deck: shuffledDeck,
    discarded: [],
  };
};

export const initializeGame = (): GameState => {
  const player1Deck = createInitialDeck();
  const player2Deck = createInitialDeck();

  // Draw initial 5 cards for each player
  const { drawnCards: player1Hand, remainingDeck: player1RemainingDeck } =
    drawCards(player1Deck, 5);
  const { drawnCards: player2Hand, remainingDeck: player2RemainingDeck } =
    drawCards(player2Deck, 5);

  return {
    players: {
      player1: {
        id: "player1",
        deck: player1RemainingDeck,
        hand: player1Hand,
        discarded: [],
        money: 0,
        base: {
          health: 20,
          position: { x: 0, y: 5 },
        },
      },
      player2: {
        id: "player2",
        deck: player2RemainingDeck,
        hand: player2Hand,
        discarded: [],
        money: 0,
        base: {
          health: 20,
          position: { x: 11, y: 6 },
        },
      },
    },
    board: createInitialUnits(),
    currentTurn: "player1",
    shop: SHOP_CARDS,
    selectedCards: [],
    selectedShopCard: null,
  };
};

export const drawCardsForTurn = (gameState: GameState): GameState => {
  const currentPlayer = gameState.currentTurn;
  const player = gameState.players[currentPlayer];

  // If deck is empty, recycle discarded cards
  const playerWithDeck =
    player.deck.length === 0 ? recycleDeck(player) : player;

  // Draw 5 new cards
  const { drawnCards, remainingDeck } = drawCards(playerWithDeck.deck, 5);

  // Move current hand to discarded pile
  const updatedPlayer = {
    ...playerWithDeck,
    deck: remainingDeck,
    hand: drawnCards,
    discarded: [...playerWithDeck.discarded, ...playerWithDeck.hand],
  };

  return {
    ...gameState,
    players: {
      ...gameState.players,
      [currentPlayer]: updatedPlayer,
    },
  };
};

export const selectCard = (gameState: GameState, cardId: string): GameState => {
  const currentPlayer = gameState.currentTurn;
  const player = gameState.players[currentPlayer];
  const card = player.hand.find((c) => c.id === cardId);

  if (!card) return gameState;

  // If it's a money card, add it to selected cards
  if (card.type === "money") {
    // Check if the card is already selected
    const isAlreadySelected = gameState.selectedCards.some(
      (selected) => selected.id === card.id
    );

    if (!isAlreadySelected) {
      return {
        ...gameState,
        selectedCards: [...gameState.selectedCards, card],
      };
    }
  }

  return gameState;
};

export const deselectCard = (
  gameState: GameState,
  cardId: string
): GameState => {
  return {
    ...gameState,
    selectedCards: gameState.selectedCards.filter((c) => c.id !== cardId),
  };
};

export const selectShopCard = (
  gameState: GameState,
  shopCard: ShopCard
): GameState => {
  return {
    ...gameState,
    selectedShopCard: shopCard,
  };
};

export const deselectShopCard = (gameState: GameState): GameState => {
  return {
    ...gameState,
    selectedShopCard: null,
  };
};

export const purchaseCard = (gameState: GameState): GameState => {
  const currentPlayer = gameState.currentTurn;
  const player = gameState.players[currentPlayer];
  const { selectedCards, selectedShopCard } = gameState;

  if (!selectedShopCard) return gameState;

  // Calculate total money from selected cards
  const totalMoney = selectedCards.reduce((sum, card) => sum + card.value, 0);

  // Check if player has enough money
  if (totalMoney < selectedShopCard.cost) {
    return gameState;
  }

  // Create the purchased card
  const newCard = createCard(selectedShopCard.type, 1);

  // Remove selected money cards from hand and add to discarded
  const remainingHand = player.hand.filter(
    (card) => !selectedCards.some((selected) => selected.id === card.id)
  );

  // Update player's state
  const updatedPlayer = {
    ...player,
    hand: remainingHand,
    discarded: [...player.discarded, ...selectedCards],
  };

  // Add the purchased card to the player's discarded pile
  updatedPlayer.discarded.push(newCard);

  return {
    ...gameState,
    players: {
      ...gameState.players,
      [currentPlayer]: updatedPlayer,
    },
    selectedCards: [],
    selectedShopCard: null,
  };
};
