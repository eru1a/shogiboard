import React from "react";
import * as shogi from "shogi-lib";
import { Piece } from "./Piece";
import { reversePiece } from "./util";

export type SquareProps = {
  piece: shogi.Piece.Piece | undefined;
  from?: boolean;
  attack?: boolean;
  last?: boolean;
  reverse?: boolean;
  handleClick: () => void;
};

export const Square: React.FC<SquareProps> = ({
  piece,
  from,
  attack,
  last,
  reverse,
  handleClick,
}) => {
  let background = "#FDD775";
  if (last) background = "sandybrown";
  if (from) background = "lightgreen";
  if (attack) background = "lightgray";

  return (
    <div
      className="square"
      style={{
        background,
        width: "100%",
        border: "1px solid #666",
        boxSizing: "border-box",
        position: "relative",
        // 駒1つが52x60
        paddingTop: `${(60 / 52) * 100}%`,
      }}
      onClick={handleClick}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          left: 0,
          bottom: 0,
        }}
      >
        {piece && <Piece piece={reverse ? reversePiece(piece) : piece} />}
      </div>
    </div>
  );
};
