import React from "react";
import * as shogi from "shogi-lib";
import { Square } from "./Square";

export type BoardProps = {
  position: shogi.Position;
  from?: shogi.Square.Square;
  attack?: Array<shogi.Square.Square>;
  handleClick: (square: shogi.Square.Square) => void;
};

export const Board: React.FC<BoardProps> = ({ position, from, attack, handleClick }) => {
  return (
    <div
      className="board"
      style={{
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        height: "100%",
        userSelect: "none",
      }}
    >
      {shogi.Square.squares.map((square, i) => (
        <Square
          key={i}
          piece={position.getPiece(square)}
          from={from !== undefined && from === square}
          attack={attack !== undefined && attack.some((sq) => sq === square)}
          handleClick={() => handleClick(square)}
        ></Square>
      ))}
    </div>
  );
};
