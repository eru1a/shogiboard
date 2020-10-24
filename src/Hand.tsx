import React from "react";
import * as shogi from "shogi-lib";
import { pieceToKIF, numToKanji } from "./util";

export type HandProps = {
  position: shogi.Position;
  color: shogi.Color.Color;
  from?: shogi.Piece.Piece;
  handleClick: (piece: shogi.Piece.Piece) => void;
};

export const Hand: React.SFC<HandProps> = ({ position, color, from, handleClick }) => {
  const pieces = shogi.Piece.handPieces.filter((piece) => shogi.Piece.color(piece) === color);

  return (
    <div
      className={`hand-${color}`}
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: 30,
        marginLeft: 3,
        marginRight: 3,
        height: "100%",
        textAlign: "center",
        transform: color === "w" ? "rotate(180deg)" : undefined,
        userSelect: "none",
      }}
    >
      <div>{color === "b" ? "☗" : "☖"}</div>
      {pieces.map((piece) => {
        const n = position.getHand(piece);
        if (n instanceof Error) {
          console.error(`position.getHand(${piece}) returned error`);
          return undefined;
        }
        if (n === 0) return undefined;
        let background = "white";
        if (from === piece) {
          background = "lightgreen";
        }
        return (
          <div key={piece}>
            <div
              onClick={() => handleClick(piece)}
              style={{
                background,
              }}
            >
              {pieceToKIF(piece)}
            </div>
            <div>{n > 1 && numToKanji(n)}</div>
          </div>
        );
      })}
    </div>
  );
};
