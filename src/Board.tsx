import React from "react";
import * as shogi from "shogi-lib";
import { Square } from "./Square";

export type BoardProps = {
  position: shogi.Position;
  from?: shogi.Square.Square;
  attack?: Array<shogi.Square.Square>;
  last?: shogi.Square.Square;
  handleClick: (square: shogi.Square.Square) => void;
};

export const Board: React.FC<BoardProps> = ({ position, from, attack, last, handleClick }) => {
  return (
    <div
      className="board"
      style={{
        display: "grid",
        width: "100%",
        height: "100%",
        gridTemplateColumns: "repeat(9, 1fr)",
        gridTemplateRows: "repeat(9, 1fr)",
        userSelect: "none",
      }}
    >
      {shogi.Square.squares.map((square, i) => {
        const { file, rank } = shogi.Square.toFileRank(square);
        return (
          <div key={i} style={{ position: "relative" }}>
            <Square
              piece={position.getPiece(square)}
              from={from !== undefined && from === square}
              attack={attack !== undefined && attack.some((sq) => sq === square)}
              last={last !== undefined && last === square}
              handleClick={() => handleClick(square)}
            ></Square>
            {rank === "a" && (
              <div
                key={`rank-${file}`}
                style={{
                  position: "absolute",
                  fontSize: 10,
                  transform: "scale(0.7)",
                  fontWeight: "bold",
                  color: "#888",
                  left: 0,
                  top: 0,
                }}
              >
                {shogi.File.toKIF(file)}
              </div>
            )}
            {file === "1" && (
              <div
                key={`file-${rank}`}
                style={{
                  position: "absolute",
                  fontSize: 10,
                  transform: "scale(0.7)",
                  fontWeight: "bold",
                  color: "#888",
                  right: 0,
                  top: 0,
                }}
              >
                {shogi.Rank.toKIF(rank)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
