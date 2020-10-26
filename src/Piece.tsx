import React from "react";
import * as shogi from "shogi-lib";

import bfu from "./img/0FU.svg";
import bgi from "./img/0GI.svg";
import bgy from "./img/0GY.svg";
import bhi from "./img/0HI.svg";
import bka from "./img/0KA.svg";
import bke from "./img/0KE.svg";
import bki from "./img/0KI.svg";
import bky from "./img/0KY.svg";
import bng from "./img/0NG.svg";
import bnk from "./img/0NK.svg";
import bny from "./img/0NY.svg";
import bry from "./img/0RY.svg";
import bto from "./img/0TO.svg";
import bum from "./img/0UM.svg";
import wfu from "./img/1FU.svg";
import wgi from "./img/1GI.svg";
import wgy from "./img/1GY.svg";
import whi from "./img/1HI.svg";
import wka from "./img/1KA.svg";
import wke from "./img/1KE.svg";
import wki from "./img/1KI.svg";
import wky from "./img/1KY.svg";
import wng from "./img/1NG.svg";
import wnk from "./img/1NK.svg";
import wny from "./img/1NY.svg";
import wry from "./img/1RY.svg";
import wto from "./img/1TO.svg";
import wum from "./img/1UM.svg";

const pieceImgMap: Map<shogi.Piece.Piece, string> = new Map([
  ["P", bfu],
  ["S", bgi],
  ["K", bgy],
  ["R", bhi],
  ["B", bka],
  ["N", bke],
  ["G", bki],
  ["L", bky],
  ["+S", bng],
  ["+N", bnk],
  ["+L", bny],
  ["+R", bry],
  ["+P", bto],
  ["+B", bum],
  ["p", wfu],
  ["s", wgi],
  ["k", wgy],
  ["r", whi],
  ["b", wka],
  ["n", wke],
  ["g", wki],
  ["l", wky],
  ["+s", wng],
  ["+n", wnk],
  ["+l", wny],
  ["+r", wry],
  ["+p", wto],
  ["+b", wum],
]);

export type PieceProps = {
  piece: shogi.Piece.Piece;
};

export const Piece: React.FC<PieceProps> = ({ piece }) => {
  return (
    <img
      className="piece"
      src={pieceImgMap.get(piece)}
      alt=""
      style={{
        display: "block",
        width: "100%",
        // width: "54.54545454545454%",
        // height: "45.45454545454545%",
      }}
    />
  );
};
