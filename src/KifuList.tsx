import React from "react";
import * as shogi from "shogi-lib";

export type KifuListProps = {
  game: shogi.Game;
  nth: number;
  handleClick: (nth: number) => void;
};

export const KifuList: React.FC<KifuListProps> = ({ game, nth, handleClick }) => {
  const makeKifuList = (game: shogi.Game) => {
    const list = [];
    for (
      let node: shogi.GameNode | undefined = game.rootNode;
      node !== undefined;
      node = node.next
    ) {
      list.push(
        node.lastMove === undefined
          ? "=== 開始局面 ==="
          : `${node.position.ply} ${node.position.turn === "b" ? "☖" : "☗"} ${shogi.Move.toUSI(
              node.lastMove
            )}`
      );
    }
    return list;
  };

  return (
    <select
      className="kifulist"
      // sizeを自動で調整するには?
      size={18}
      value={nth}
      onChange={(e) => handleClick(Number(e.target.value))}
    >
      {makeKifuList(game).map((item, i) => {
        return (
          <option key={i} value={i}>
            {item}
          </option>
        );
      })}
    </select>
  );
};
