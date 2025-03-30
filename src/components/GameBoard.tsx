import React from "react";
import styled from "@emotion/styled";
import { GameState, Unit, Position } from "../types/game";
import { GRID_SIZE } from "../types/game";
import { selectUnit, deselectUnit, moveUnit } from "../utils/gameUtils";

interface GameBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
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

const Cell = styled.div<{ isSelected: boolean; isValidMove: boolean }>`
  background-color: ${(props) =>
    props.isSelected ? "#e3f2fd" : props.isValidMove ? "#e8f5e9" : "#ffffff"};
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? "#bbdefb" : props.isValidMove ? "#c8e6c9" : "#f5f5f5"};
  }
`;

const UnitMarker = styled.div<{ isSelected: boolean; isPlayer1: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  background-color: ${(props) =>
    props.isSelected ? "#2196f3" : props.isPlayer1 ? "#90caf9" : "#f44336"};
  color: white;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const BaseHealth = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 0.9em;
  color: #d32f2f;
  font-weight: bold;
`;

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onGameStateChange,
}) => {
  const handleCellClick = (row: number, col: number) => {
    const position: Position = { row, col };

    if (gameState.selectedUnit) {
      // If a unit is selected, try to move it
      const newState = moveUnit(gameState, position);
      if (newState !== gameState) {
        onGameStateChange(newState);
      }
    } else {
      // Check if there's a unit at this position
      const currentPlayer = gameState.players[gameState.currentTurn];
      const unit = currentPlayer.units.find(
        (u) => u.position.row === row && u.position.col === col
      );

      if (unit) {
        // Select the unit
        onGameStateChange(selectUnit(gameState, position, unit.type));
      }
    }
  };

  const handleUnitClick = (
    row: number,
    col: number,
    type: "miner" | "soldier"
  ) => {
    if (gameState.selectedUnit) {
      // Deselect the unit
      onGameStateChange(deselectUnit(gameState));
    } else {
      // Select the unit
      onGameStateChange(selectUnit(gameState, { row, col }, type));
    }
  };

  const isValidMove = (row: number, col: number): boolean => {
    if (!gameState.selectedUnit || gameState.selectedMoveCards.length === 0) {
      return false;
    }

    const currentPlayer = gameState.players[gameState.currentTurn];
    const targetPosition: Position = { row, col };
    const currentPosition = gameState.selectedUnit.position;

    // Check if target is within bounds
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
      return false;
    }

    // Check if target is not occupied
    if (
      currentPlayer.units.some(
        (u) =>
          u.position.row === targetPosition.row &&
          u.position.col === targetPosition.col
      )
    ) {
      return false;
    }

    // Check if the move is only one space away (horizontally or vertically)
    const rowDiff = Math.abs(targetPosition.row - currentPosition.row);
    const colDiff = Math.abs(targetPosition.col - currentPosition.col);
    const isOneSpace =
      (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

    return isOneSpace;
  };

  const renderCell = (row: number, col: number) => {
    const currentPlayer = gameState.players[gameState.currentTurn];
    const otherPlayer =
      gameState.players[
        gameState.currentTurn === "player1" ? "player2" : "player1"
      ];

    // Check for units from both players
    const player1Unit = gameState.players.player1.units.find(
      (u) => u.position.row === row && u.position.col === col
    );
    const player2Unit = gameState.players.player2.units.find(
      (u) => u.position.row === row && u.position.col === col
    );
    const unit = player1Unit || player2Unit;

    const isSelected =
      gameState.selectedUnit?.position.row === row &&
      gameState.selectedUnit?.position.col === col;
    const isValidMoveTarget = isValidMove(row, col);

    return (
      <Cell
        key={`${row}-${col}`}
        isSelected={isSelected}
        isValidMove={isValidMoveTarget}
        onClick={() => handleCellClick(row, col)}
      >
        {unit && (
          <UnitMarker
            isSelected={isSelected}
            isPlayer1={!!player1Unit}
            onClick={(e) => {
              e.stopPropagation();
              handleUnitClick(row, col, unit.type);
            }}
          >
            {unit.type === "miner" ? "⛏️" : "⚔️"}
          </UnitMarker>
        )}
        {row === currentPlayer.base.position.row &&
          col === currentPlayer.base.position.col && (
            <BaseHealth>{currentPlayer.base.health} HP</BaseHealth>
          )}
        {row === otherPlayer.base.position.row &&
          col === otherPlayer.base.position.col && (
            <BaseHealth>{otherPlayer.base.health} HP</BaseHealth>
          )}
      </Cell>
    );
  };

  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      cells.push(renderCell(row, col));
    }
  }

  return (
    <BoardContainer>
      <Grid>{cells}</Grid>
    </BoardContainer>
  );
};
