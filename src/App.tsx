import React, { useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { Shop } from "./components/Shop";
import { Hand } from "./components/Hand";
import {
  initializeGame,
  drawCardsForTurn,
  selectCard,
  deselectCard,
  selectShopCard,
  deselectShopCard,
  purchaseCard,
} from "./utils/gameUtils";
import { ShopCard, GameState, Player, Card } from "./types/game";
import styled from "@emotion/styled";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const TurnIndicator = styled.div<{ currentTurn: "player1" | "player2" }>`
  font-size: 1.5em;
  font-weight: bold;
  color: ${(props) =>
    props.currentTurn === "player1" ? "#44ff44" : "#4444ff"};
`;

const DeckCount = styled.div`
  font-size: 1.2em;
  color: #666;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
`;

const GameLayout = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: #44ff44;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #33cc33;
  }
`;

const App = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const handleStartTurn = () => {
    // First, draw cards for the current player
    const stateWithNewCards = drawCardsForTurn(gameState);

    // Then switch turns
    const newState: GameState = {
      ...stateWithNewCards,
      currentTurn: gameState.currentTurn === "player1" ? "player2" : "player1",
      selectedCards: [], // Clear selected cards
      selectedShopCard: null, // Clear selected shop card
    };

    setGameState(newState);
  };

  const handleCardSelect = (cardIndex: number) => {
    const currentPlayer = gameState.players[gameState.currentTurn];
    const card = currentPlayer.hand[cardIndex];
    if (card && card.type === "money") {
      const newState = selectCard(gameState, card.id);
      setGameState(newState);
    }
  };

  const handleCardDeselect = (cardIndex: number) => {
    const currentPlayer = gameState.players[gameState.currentTurn];
    const card = currentPlayer.hand[cardIndex];
    if (card) {
      const newState = deselectCard(gameState, card.id);
      setGameState(newState);
    }
  };

  const handleShopCardSelect = (card: ShopCard) => {
    const newState = selectShopCard(gameState, card);
    setGameState(newState);
  };

  const handleShopCardDeselect = () => {
    const newState = deselectShopCard(gameState);
    setGameState(newState);
  };

  const handlePurchase = () => {
    const newState = purchaseCard(gameState);
    setGameState(newState);
  };

  const currentPlayer = gameState.players[gameState.currentTurn];
  const selectedMoney = gameState.selectedCards.reduce((total, card) => {
    return total + (card.type === "money" ? 1 : 0);
  }, 0);

  return (
    <GameContainer>
      <Title>Vibe Game</Title>
      <TurnIndicator currentTurn={gameState.currentTurn}>
        Current Turn:{" "}
        {gameState.currentTurn === "player1" ? "Player 1" : "Player 2"}
      </TurnIndicator>

      <Hand
        cards={currentPlayer.hand}
        selectedCards={gameState.selectedCards}
        onSelect={handleCardSelect}
        onDeselect={handleCardDeselect}
      />

      <GameLayout>
        <GameBoard gameState={gameState} />
        <Shop
          cards={gameState.shop}
          selectedShopCard={gameState.selectedShopCard}
          selectedMoney={selectedMoney}
          onSelect={handleShopCardSelect}
          onDeselect={handleShopCardDeselect}
          onPurchase={handlePurchase}
        />
      </GameLayout>

      <PlayerInfo>
        <div>
          Current Player:{" "}
          {gameState.currentTurn === "player1" ? "Player 1" : "Player 2"}
        </div>
        <div>Money: {currentPlayer.money}</div>
        <div>Deck: {currentPlayer.deck.length} cards</div>
        <div>Discarded: {currentPlayer.discarded.length} cards</div>
      </PlayerInfo>

      <Button onClick={handleStartTurn}>End Turn</Button>
    </GameContainer>
  );
};

export default App;
