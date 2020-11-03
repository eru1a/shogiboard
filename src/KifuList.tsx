import React from "react";
import * as shogi from "shogi-lib";
import { moveDataToKIF } from "./util";

export type KifuListProps = {
  game: shogi.Game;
  uid: number;
  size?: number;
  handleClick: (uid: number) => void;
};

export const KifuList: React.FC<KifuListProps> = ({ game, uid, size, handleClick }) => {
  const makeKifuList = (game: shogi.Game): Array<[string, number]> => {
    const list: Array<[string, number]> = [];
    let node = game.currentNode;
    while (true) {
      list.unshift([moveDataToKIF(node.lastMove), node.uid]);
      if (node.prev === undefined) break;
      node = node.prev;
    }

    node = game.currentNode;
    list.pop();
    while (true) {
      list.push([moveDataToKIF(node.lastMove), node.uid]);
      if (node.next === undefined) break;
      node = node.next;
    }

    return list;
  };

  return (
    <select
      className="kifulist"
      // TODO: sizeを自動で調整するには?
      size={size ?? 10}
      value={uid}
      onChange={(e) => handleClick(Number(e.target.value))}
      style={{ width: "11em" }}
    >
      {makeKifuList(game).map(([kif, uid]) => {
        return (
          <option key={uid} value={uid}>
            {kif}
          </option>
        );
      })}
    </select>
  );
};
