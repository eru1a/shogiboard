import React from "react";
import * as shogi from "shogi-lib";

const moveDataToKIF = (moveData: shogi.MoveData.MoveData) => {
  const kif = shogi.MoveData.toKIF(moveData, { turnUnicode: true });
  switch (moveData.type) {
    case "md_initial":
      return kif.move;
    case "md_normal":
      return `${kif.ply}${kif.turn}${kif.move}${kif.from}`;
    case "md_drop":
    case "md_toryo":
    case "md_chudan":
      return `${kif.ply}${kif.turn}${kif.move}`;
  }
};

export type KifuListProps = {
  game: shogi.Game;
  nth: number;
  size?: number;
  handleClick: (nth: number) => void;
};

export const KifuList: React.FC<KifuListProps> = ({ game, nth, size, handleClick }) => {
  const makeKifuList = (game: shogi.Game) => {
    const list = [];
    for (
      let node: shogi.GameNode | undefined = game.rootNode;
      node !== undefined;
      node = node.next
    ) {
      list.push(moveDataToKIF(node.lastMove));
    }
    return list;
  };

  return (
    <select
      className="kifulist"
      // TODO: sizeを自動で調整するには?
      size={size ?? 10}
      value={nth}
      onChange={(e) => handleClick(Number(e.target.value))}
      style={{ width: "11em" }}
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
