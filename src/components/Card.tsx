import React from "react";
import styled from "@emotion/styled";
import { Card as CardType } from "../types/game";

interface CardProps {
  card: CardType;
  onClick?: () => void;
}

const CardContainer = styled.div`
  width: 100px;
  height: 150px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid #ccc;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTypeText = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
`;

const CardValue = styled.div`
  font-size: 1.5em;
  color: #666;
  margin-top: 10px;
`;

export const Card = ({ card, onClick }: CardProps) => {
  return (
    <CardContainer onClick={onClick}>
      <CardTypeText>{card.type}</CardTypeText>
      <CardValue>{card.value}</CardValue>
    </CardContainer>
  );
};
