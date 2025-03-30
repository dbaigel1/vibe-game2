import React from "react";
import styled from "@emotion/styled";
import { Card } from "../types/game";

interface HandProps {
  cards: Card[];
  selectedCards: Card[];
  onSelect: (cardIndex: number) => void;
  onDeselect: (cardIndex: number) => void;
}

const HandContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  margin: 20px 0;
  min-height: 120px;
  align-items: center;
`;

const CardItem = styled.div<{ isSelected: boolean; isMoney: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  background: ${(props) => (props.isSelected ? "#e3f2fd" : "white")};
  border-radius: 8px;
  border: 2px solid
    ${(props) =>
      props.isSelected ? "#2196f3" : props.isMoney ? "#4caf50" : "#ddd"};
  cursor: ${(props) => (props.isMoney ? "pointer" : "default")};
  transition: all 0.2s ease;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: ${(props) => (props.isMoney ? "translateY(-4px)" : "none")};
    box-shadow: ${(props) =>
      props.isMoney
        ? "0 4px 8px rgba(0, 0, 0, 0.2)"
        : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  }
`;

const CardType = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
`;

const CardValue = styled.div`
  color: #666;
  font-size: 0.9em;
`;

export const Hand = ({
  cards,
  selectedCards,
  onSelect,
  onDeselect,
}: HandProps) => {
  return (
    <HandContainer>
      {cards.map((card, index) => {
        const isSelected = selectedCards.some(
          (selected) => selected.id === card.id
        );
        const isMoney = card.type === "money";
        return (
          <CardItem
            key={card.id}
            isSelected={isSelected}
            isMoney={isMoney}
            onClick={() =>
              isMoney && (isSelected ? onDeselect(index) : onSelect(index))
            }
          >
            <CardType>{card.type}</CardType>
            <CardValue>Value: {card.value}</CardValue>
          </CardItem>
        );
      })}
    </HandContainer>
  );
};
