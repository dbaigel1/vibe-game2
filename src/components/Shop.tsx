import React from "react";
import styled from "@emotion/styled";
import type { ShopCard, Card } from "../types/game";

interface ShopProps {
  cards: ShopCard[];
  onCardClick: (card: ShopCard) => void;
  selectedCard: ShopCard | null;
  onPurchase: () => void;
  selectedMoneyCards: Card[];
}

const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const ShopTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5em;
`;

const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ShopCardContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: ${(props) => (props.isSelected ? "#e3f2fd" : "#ffffff")};
  border: 2px solid ${(props) => (props.isSelected ? "#2196f3" : "#ddd")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ShopCardName = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
`;

const ShopCardCost = styled.div`
  font-size: 1.1em;
  color: #2e7d32;
  font-weight: bold;
`;

const ShopCardDescription = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const PurchaseButton = styled.button<{ disabled: boolean }>`
  padding: 10px 20px;
  font-size: 1em;
  background-color: ${(props) => (props.disabled ? "#bdbdbd" : "#1976d2")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#bdbdbd" : "#1565c0")};
  }
`;

export const Shop: React.FC<ShopProps> = ({
  cards,
  onCardClick,
  selectedCard,
  onPurchase,
  selectedMoneyCards,
}) => {
  const totalMoney = selectedMoneyCards.reduce(
    (sum, card) => sum + (card.type === "money" ? card.value : 0),
    0
  );

  return (
    <ShopContainer>
      <ShopTitle>Shop</ShopTitle>
      <ShopGrid>
        {cards.map((card) => (
          <ShopCardContainer
            key={card.type}
            isSelected={selectedCard?.type === card.type}
            onClick={() => onCardClick(card)}
          >
            <ShopCardName>{card.type}</ShopCardName>
            <ShopCardCost>Cost: {card.cost}</ShopCardCost>
            <ShopCardDescription>{card.description}</ShopCardDescription>
          </ShopCardContainer>
        ))}
      </ShopGrid>
      <PurchaseButton
        onClick={onPurchase}
        disabled={!selectedCard || totalMoney < selectedCard.cost}
      >
        Purchase ({totalMoney}/{selectedCard?.cost || 0})
      </PurchaseButton>
    </ShopContainer>
  );
};
