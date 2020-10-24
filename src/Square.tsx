import React from "react";
import * as shogi from "shogi-lib";
import { pieceToKIF } from "./util";

export type PieceProps = {
  piece: shogi.Piece.Piece;
};

export const Piece: React.FC<PieceProps> = ({ piece }) => {
  const white = shogi.Piece.color(piece) === "w";
  return (
    <div
      className="piece"
      style={{
        transform: white ? "rotate(180deg)" : undefined,
      }}
    >
      {piece !== undefined ? pieceToKIF(piece) : undefined}
    </div>
  );
};

export type SquareProps = {
  piece: shogi.Piece.Piece | undefined;
  from: boolean;
  attack: boolean;
  handleClick: () => void;
};

export const Square: React.FC<SquareProps> = ({ piece, from, attack, handleClick }) => {
  let background = "white";
  if (from) {
    background = "lightgreen";
  } else if (attack) {
    background = "lightgray";
  }

  return (
    <div
      className="square"
      style={{
        background,
        fontSize: 30,
        border: "1px solid #666",
        width: "11.111111%",
        height: "11.111111%",
        boxSizing: "border-box",
        textAlign: "center",
      }}
      onClick={handleClick}
    >
      {piece === undefined ? <span>{"　"}</span> : <Piece piece={piece} />}
    </div>
  );
};
