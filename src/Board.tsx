import React from "react";
import * as shogi from "shogi-lib";
import { Square } from "./Square";

export type BoardProps = {
  position: shogi.Position;
  from?: shogi.Square.Square;
  attack?: Array<shogi.Square.Square>;
  last?: shogi.Square.Square;
  reverse?: boolean;
  handleClick: (square: shogi.Square.Square) => void;
  handleBoardDrop: (from: shogi.Square.Square, to: shogi.Square.Square) => void;
  handleHandDrop: (piece: shogi.Piece.Piece, to: shogi.Square.Square) => void;
  handleDragStart: (from: shogi.Square.Square) => void;
  handleDragEnd: () => void;
};

export const Board: React.FC<BoardProps> = ({
  position,
  from,
  attack,
  last,
  reverse,
  handleClick,
  handleBoardDrop,
  handleHandDrop,
  handleDragStart,
  handleDragEnd,
}) => {
  const squares = shogi.Square.squares.concat();
  if (reverse) squares.reverse();
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
        boxSizing: "border-box",
      }}
    >
      {squares.map((square, i) => {
        const { file, rank } = shogi.Square.toFileRank(square);
        return (
          <div key={i} style={{ position: "relative" }}>
            <Square
              piece={position.getPiece(square)}
              square={square}
              from={from !== undefined && from === square}
              attack={attack !== undefined && attack.some((sq) => sq === square)}
              last={last !== undefined && last === square}
              reverse={reverse}
              handleClick={() => handleClick(square)}
              handleBoardDrop={handleBoardDrop}
              handleHandDrop={handleHandDrop}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
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
                  left: reverse ? undefined : -3,
                  top: reverse ? undefined : -3,
                  right: reverse ? -3 : undefined,
                  bottom: reverse ? -3 : undefined,
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
                  right: reverse ? undefined : -3,
                  top: reverse ? undefined : -3,
                  left: reverse ? -3 : undefined,
                  bottom: reverse ? -3 : undefined,
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
