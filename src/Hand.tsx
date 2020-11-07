import React from "react";
import { useDrag } from "react-dnd";
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
        gridTemplateColumns: "repeat(9, 1fr)",
        userSelect: "none",
        position: "relative",
        // 駒1つが52x60なので駒台は52*9x60
        // => 60/(52*9)*100 = 12.82...
        paddingTop: `${(60 / (52 * 9)) * 100}%`,
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
          <div style={{ position: "relative", width: "100%" }} key={piece}>
            <HandPiece
              piece={piece}
              displayPiece={reverse ? reversePiece(piece) : piece}
              n={n}
              color={color2}
              background={background}
              handleClick={() => handleClick(piece)}
            />
          </div>
        );
      })}
    </div>
  );
};

export type HandPieceProps = {
  piece: shogi.Piece.Piece;
  displayPiece: shogi.Piece.Piece;
  n: number;
  color: string;
  background: string | undefined;
  handleClick: () => void;
};

export const HandPiece: React.FC<HandPieceProps> = ({
  piece,
  displayPiece,
  n,
  color,
  background,
  handleClick,
}) => {
  const [, drag] = useDrag({
    item: {
      type: "hand",
      piece: piece,
    },
  });

  return (
    <div
      ref={drag}
      onClick={handleClick}
      style={{
        position: "absolute",
        background,
        left: 0,
        bottom: 0,
        width: "100%",
      }}
    >
      <Piece piece={displayPiece} />
      {n > 1 && (
        <div
          style={{
            position: "absolute",
            color: "red",
            fontWeight: "bold",
            fontSize: 7,
            top: color === "b" ? 0 : undefined,
            bottom: color === "w" ? 0 : undefined,
            right: 0,
          }}
        >
          {n}
        </div>
      )}
    </div>
  );
};
