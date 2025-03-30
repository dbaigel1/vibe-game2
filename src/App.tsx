import React, { useState } from "react";
import styled from "@emotion/styled";
import { GameState, Card, ShopCard } from "./types/game";
import {
  initializeGame,
  drawCardsForTurn,
  selectCard,
  deselectCard,
  selectShopCard,
  deselectShopCard,
  purchaseCard,
  selectMoveCard,
  deselectMoveCard,
} from "./utils/gameUtils";
import { GameBoard } from "./components/GameBoard";
import { Hand } from "./components/Hand";
import { Shop } from "./components/Shop";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Money = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #2e7d32;
`;

const TurnIndicator = styled.div<{ isPlayer1: boolean }>`
  font-size: 1.2em;
  font-weight: bold;
  color: ${(props) => (props.isPlayer1 ? "#1976d2" : "#d32f2f")};
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const GameLayout = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const handleStartTurn = () => {
    // First draw cards for the current player
    const stateWithNewCards = drawCardsForTurn(gameState);

    // Then switch turns
    const newState: GameState = {
      ...stateWithNewCards,
      currentTurn: gameState.currentTurn === "player1" ? "player2" : "player1",
      selectedCards: [], // Clear selected cards
      selectedShopCard: null, // Clear selected shop card
      selectedUnit: null, // Clear selected unit
      selectedMoveCards: [], // Clear selected move cards
    };

    setGameState(newState);
  };

  const handleCardClick = (card: Card) => {
    if (card.type === "move") {
      // If it's already selected, deselect it
      if (gameState.selectedMoveCards.some((c) => c.id === card.id)) {
        setGameState(deselectMoveCard(gameState, card));
      } else {
        // Otherwise select it
        setGameState(selectMoveCard(gameState, card));
      }
    } else if (card.type === "money") {
      // If it's already selected, deselect it
      if (gameState.selectedCards.some((c) => c.id === card.id)) {
        setGameState(deselectCard(gameState, card.id));
      } else {
        // Otherwise select it
        setGameState(selectCard(gameState, card.id));
      }
    }
  };

  const handleShopCardClick = (shopCard: ShopCard) => {
    setGameState(selectShopCard(gameState, shopCard));
  };

  const handlePurchase = () => {
    setGameState(purchaseCard(gameState));
  };

  const currentPlayer = gameState.players[gameState.currentTurn];
  const isPlayer1 = gameState.currentTurn === "player1";

  return (
    <AppContainer>
      <GameInfo>
        <PlayerInfo>
          <TurnIndicator isPlayer1={isPlayer1}>
            {isPlayer1 ? "Player 1's Turn" : "Player 2's Turn"}
          </TurnIndicator>
          <Money>Money: {currentPlayer.money}</Money>
        </PlayerInfo>
        <Button onClick={handleStartTurn}>End Turn</Button>
      </GameInfo>

      <GameLayout>
        <GameBoard gameState={gameState} onGameStateChange={setGameState} />
        <Shop
          cards={gameState.shop}
          onCardClick={handleShopCardClick}
          selectedCard={gameState.selectedShopCard}
          onPurchase={handlePurchase}
          selectedMoneyCards={gameState.selectedCards}
        />
      </GameLayout>

      <Hand
        cards={currentPlayer.hand}
        onCardClick={handleCardClick}
        selectedCards={gameState.selectedCards}
        selectedMoveCards={gameState.selectedMoveCards}
      />
    </AppContainer>
  );
};

export default App;
