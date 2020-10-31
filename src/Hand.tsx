import React from "react";
import * as shogi from "shogi-lib";
import { Piece } from "./Piece";
import { reversePiece } from "./util";

export type HandProps = {
  position: shogi.Position;
  color: shogi.Color.Color;
  from?: shogi.Piece.Piece;
  reverse?: boolean;
  handleClick: (piece: shogi.Piece.Piece) => void;
};

export const Hand: React.SFC<HandProps> = ({ position, color, from, reverse, handleClick }) => {
  const pieces = shogi.Piece.handPieces.filter((piece) => shogi.Piece.color(piece) === color);
  // reverseがtrueだったら逆のcolorにする
  const color2 = reverse ? shogi.Color.inv(color) : color;

  return (
    <div
      className={`hand-${color}`}
      style={{
        background: "#FDD775",
        border: "1px solid #666",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateRows: "1fr",
        gridTemplateColumns: "repeat(9, 1fr)",
        userSelect: "none",
        position: "relative",
        // 駒1つが52x60なので駒台は52*9x60
        // => 60/(52*9)*100 = 12.82...
        paddingTop: "12.82051282051282%",
      }}
    >
      {pieces.map((piece) => {
        const n = position.getHand(piece);
        if (n instanceof Error) {
          // ???
          console.error(`position.getHand(${piece}) returned error`);
          return undefined;
        }
        if (n === 0) return undefined;
        let background = undefined;
        if (from === piece) {
          background = "lightgreen";
        }
        return (
          <div
            style={{
              position: "relative",
            }}
            key={piece}
          >
            <div
              onClick={() => handleClick(piece)}
              style={{
                position: "absolute",
                background,
                left: 0,
                bottom: 0,
              }}
            >
              <Piece piece={reverse ? reversePiece(piece) : piece} />
              {n > 1 && (
                <div
                  style={{
                    position: "absolute",
                    color: "red",
                    fontWeight: "bold",
                    fontSize: 7,
                    top: color2 === "b" ? 0 : undefined,
                    bottom: color2 === "w" ? 0 : undefined,
                    right: 0,
                  }}
                >
                  {n}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
