import React from "react";
import styled from "@emotion/styled";
import { GameState, Unit } from "../types/game";
import { GRID_SIZE } from "../types/game";

interface GameBoardProps {
  gameState: GameState;
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 600px;
  height: 600px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, 1fr);
  gap: 2px;
  background: #ddd;
  padding: 2px;
  border-radius: 5px;
  width: 100%;
  height: 100%;
`;

const Cell = styled.div<{ isBase: boolean }>`
  aspect-ratio: 1;
  background: ${(props) => (props.isBase ? "#ff6b6b" : "#fff")};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  position: relative;
`;

const UnitMarker = styled.div<{ owner: "player1" | "player2" }>`
  width: 80%;
  height: 80%;
  background: ${(props) => (props.owner === "player1" ? "#4caf50" : "#f44336")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5em;
`;

const BaseHealth = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
`;

export const GameBoard = ({ gameState }: GameBoardProps) => {
  const renderCell = (x: number, y: number) => {
    const unit = gameState.board.find(
      (u) => u.position.x === x && u.position.y === y
    );
    const isBase1 = x === 0 && y === 5;
    const isBase2 = x === 11 && y === 6;
    const isBase = isBase1 || isBase2;

    return (
      <Cell key={`${x}-${y}`} isBase={isBase}>
        {isBase && (
          <>
            <BaseHealth>
              {isBase1
                ? gameState.players.player1.base.health
                : gameState.players.player2.base.health}
            </BaseHealth>
          </>
        )}
        {unit && (
          <UnitMarker owner={unit.owner}>
            {unit.type === "soldier" ? "S" : "M"}
          </UnitMarker>
        )}
      </Cell>
    );
  };

  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cells.push(renderCell(x, y));
    }
  }

  return (
    <BoardContainer>
      <Grid>{cells}</Grid>
    </BoardContainer>
  );
};
