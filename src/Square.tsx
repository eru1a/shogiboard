import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DragItem } from "./Game";
import * as shogi from "shogi-lib";
import { Piece } from "./Piece";
import { reversePiece } from "./util";

export type SquareProps = {
  piece: shogi.Piece.Piece | undefined;
  // TODO: squareを渡さないようにする
  square: shogi.Square.Square;
  from?: boolean;
  attack?: boolean;
  last?: boolean;
  reverse?: boolean;
  handleClick: () => void;
  handleBoardDrop: (from: shogi.Square.Square, to: shogi.Square.Square) => void;
  handleHandDrop: (piece: shogi.Piece.Piece, to: shogi.Square.Square) => void;
  handleDragStart: (from: shogi.Square.Square) => void;
  handleDragEnd: () => void;
};

export const Square: React.FC<SquareProps> = ({
  piece,
  square,
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
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag({
    canDrag: () => piece !== undefined,
    begin: () => handleDragStart(square),
    end: () => handleDragEnd(),
    item: {
      type: "board",
      from: square,
    },
  });
  const [, drop] = useDrop({
    accept: ["board", "hand"],
    drop(item: DragItem) {
      if (!ref.current) return;
      switch (item.type) {
        case "board":
          handleBoardDrop(item.from, square);
          break;
        case "hand":
          handleHandDrop(item.piece, square);
          break;
      }
    },
  });
  drag(drop(ref));

  let background = "#FDD775";
  if (last) background = "sandybrown";
  if (from) background = "lightgreen";
  if (attack) background = "lightgray";

  return (
    // TODO: 直接backgroundを描画するのではなくOverlayを用意する
    <div
      ref={ref}
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
