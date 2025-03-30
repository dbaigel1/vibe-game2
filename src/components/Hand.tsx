import React from "react";
import styled from "@emotion/styled";
import { Card } from "../types/game";

interface HandProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  selectedCards: Card[];
  selectedMoveCards: Card[];
}

const HandContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  overflow-x: auto;
`;

const CardContainer = styled.div<{ isSelected: boolean; isMoveCard: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isSelected ? (props.isMoveCard ? "#e3f2fd" : "#e8f5e9") : "#ffffff"};
  border: 2px solid
    ${(props) =>
      props.isSelected ? (props.isMoveCard ? "#2196f3" : "#4caf50") : "#ddd"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardType = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
`;

const CardValue = styled.div`
  font-size: 1.1em;
  color: #2e7d32;
  font-weight: bold;
`;

const CardDescription = styled.div`
  font-size: 0.9em;
  color: #666;
`;

export const Hand: React.FC<HandProps> = ({
  cards,
  onCardClick,
  selectedCards,
  selectedMoveCards,
}) => {
  return (
    <HandContainer>
      {cards.map((card) => (
        <CardContainer
          key={card.id}
          isSelected={
            (card.type === "move" &&
              selectedMoveCards.some((c) => c.id === card.id)) ||
            (card.type === "money" &&
              selectedCards.some((c) => c.id === card.id))
          }
          isMoveCard={card.type === "move"}
          onClick={() => onCardClick(card)}
        >
          <CardType>{card.type}</CardType>
          <CardValue>Value: {card.value}</CardValue>
          <CardDescription>{card.description}</CardDescription>
        </CardContainer>
      ))}
    </HandContainer>
  );
};
