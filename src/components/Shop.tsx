import React from "react";
import styled from "@emotion/styled";
import { ShopCard } from "../types/game";

interface ShopProps {
  cards: ShopCard[];
  selectedShopCard: ShopCard | null;
  selectedMoney: number;
  onSelect: (card: ShopCard) => void;
  onDeselect: () => void;
  onPurchase: () => void;
}

const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 200px;
`;

const ShopTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.2em;
`;

const ShopCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ShopCardItem = styled.div<{ isSelected: boolean; canAfford: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  background: ${(props) => (props.isSelected ? "#e3f2fd" : "white")};
  border-radius: 5px;
  border: 2px solid ${(props) => (props.isSelected ? "#2196f3" : "#ddd")};
  cursor: ${(props) => (props.canAfford ? "pointer" : "not-allowed")};
  opacity: ${(props) => (props.canAfford ? 1 : 0.5)};
  transition: transform 0.2s;

  &:hover {
    transform: ${(props) => (props.canAfford ? "translateY(-2px)" : "none")};
  }
`;

const CardName = styled.div`
  font-weight: bold;
  color: #333;
`;

const CardCost = styled.div`
  color: #666;
  font-size: 0.9em;
`;

const CardDescription = styled.div`
  color: #888;
  font-size: 0.8em;
`;

const PurchaseButton = styled.button<{ canAfford: boolean }>`
  margin-top: 10px;
  padding: 8px 16px;
  background: ${(props) => (props.canAfford ? "#4caf50" : "#ccc")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.canAfford ? "pointer" : "not-allowed")};
  opacity: ${(props) => (props.canAfford ? 1 : 0.5)};

  &:hover {
    background: ${(props) => (props.canAfford ? "#45a049" : "#ccc")};
  }
`;

export const Shop = ({
  cards,
  selectedShopCard,
  selectedMoney,
  onSelect,
  onDeselect,
  onPurchase,
}: ShopProps) => {
  return (
    <ShopContainer>
      <ShopTitle>Shop</ShopTitle>
      <ShopCardContainer>
        {cards.map((card) => {
          const isSelected = selectedShopCard?.type === card.type;
          const canAfford = selectedMoney >= card.cost;

          return (
            <ShopCardItem
              key={card.type}
              isSelected={isSelected}
              canAfford={canAfford}
              onClick={() => (isSelected ? onDeselect() : onSelect(card))}
            >
              <CardName>{card.type}</CardName>
              <CardCost>Cost: {card.cost} money</CardCost>
              <CardDescription>{card.description}</CardDescription>
            </ShopCardItem>
          );
        })}
      </ShopCardContainer>
      {selectedShopCard && (
        <PurchaseButton
          canAfford={selectedMoney >= selectedShopCard.cost}
          onClick={onPurchase}
        >
          Purchase ({selectedMoney}/{selectedShopCard.cost} money)
        </PurchaseButton>
      )}
    </ShopContainer>
  );
};
