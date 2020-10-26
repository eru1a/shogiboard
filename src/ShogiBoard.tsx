import React, { useState } from "react";
import * as shogi from "shogi-lib";
import { Board } from "./Board";
import { Hand } from "./Hand";
import { KifuList } from "./KifuList";
import * as _ from "lodash";
import styled from "styled-components";

// よく分からない適当
// 任意のサイズでスクロールする必要がないようにぴったり合わせるには?
const ShogiBoardWrapper = styled.div`
  @media (min-aspect-ratio: 99/100) {
    width: 67vh;
  }
  @media (max-aspect-ratio: 100/99) {
    width: 67vw;
  }
`;

const calcNth = (game: shogi.Game) => {
  let i = 0;
  let node: shogi.GameNode | undefined = game.rootNode;
  while (node !== undefined) {
    if (node === game.currentNode) break;
    node = node.next;
    i++;
  }
  return i;
};

type ClickFrom =
  | undefined
  | { type: "normal"; from: shogi.Square.Square }
  | { type: "drop"; piece: shogi.Piece.Piece };

export const ShogiBoard = () => {
  const [game, setGame] = useState(new shogi.Game());
  const [clickFrom, setClickFrom] = useState<ClickFrom>(undefined);
  const [attack, setAttack] = useState<Array<shogi.Square.Square>>([]);

  // attackを変更する関数
  const updateAttack = (clickFrom: ClickFrom, game: shogi.Game) => {
    setAttack([]);
    if (clickFrom === undefined) return;
    const legalMoves = game.currentNode.position.legalMoves();
    if (clickFrom.type === "normal") {
      setAttack(
        legalMoves
          .filter((move) => move.type === "normal" && move.from === clickFrom.from)
          .map((move) => move.to)
      );
      return;
    }
    setAttack(
      legalMoves
        .filter(
          (move) =>
            move.type === "drop" && move.pieceType === shogi.Piece.pieceType(clickFrom.piece)
        )
        .map((move) => move.to)
    );
  };

  // clickFromを変更した時はattackも変更する
  // stateが他のstateの値に依存している時ってどう書くんだろう?
  // useEffect(updateAttack, [clickFrom])だと二重に描画されてしまう
  const updateClickFrom = (from: ClickFrom, game: shogi.Game) => {
    setClickFrom(from);
    updateAttack(from, game);
  };

  // gameを変更した時はclickFromとattackも変更する
  const updateGame = (clone: shogi.Game) => {
    setGame(clone);
    setClickFrom(undefined);
    updateAttack(undefined, game);
  };

  const position = game.currentNode.position;
  console.log(position.toSFEN());

  const handleBoardClick = (square: shogi.Square.Square) => {
    const legalMoves = position.legalMoves();

    if (clickFrom === undefined) {
      if (!legalMoves.some((move) => move.type === "normal" && move.from === square)) {
        return;
      }
      updateClickFrom({ type: "normal", from: square }, game);
      return;
    }

    const to = square;

    if (clickFrom.type === "drop") {
      const move: shogi.Move.Move = {
        type: "drop",
        to,
        pieceType: shogi.Piece.pieceType(clickFrom.piece),
      };
      if (!legalMoves.some((move2) => shogi.Move.equal(move2, move))) {
        updateClickFrom(undefined, game);
        return;
      }
      const clone = _.cloneDeep(game);
      // moveする度にchromeのデバッガーが勝手に止めてくるんだけど何で?
      if (clone.move(move) instanceof Error) {
        // ???
        console.error(`illegal move: ${move} ${position}`);
      }
      updateGame(clone);
      return;
    }

    if (
      !legalMoves.some(
        (move) => move.type === "normal" && move.from === clickFrom.from && move.to === to
      )
    ) {
      // toに駒がある時はtoをclickFromにセットしてもいいかも↓
      // updateClickFrom({ type: "normal", from: to }, game);
      updateClickFrom(undefined, game);
      return;
    }
    const piece = position.getPiece(clickFrom.from);
    if (piece === undefined) {
      // ???
      console.error(`position.getPiece(from) = undefined: ${position}`);
      updateClickFrom(undefined, game);
      return;
    }
    let promotion = false;
    if (shogi.Piece.canPromote(piece, clickFrom.from, to)) {
      if (shogi.Piece.needForcePromotion(piece, to)) {
        promotion = true;
      } else {
        promotion = window.confirm("promote?");
      }
    }
    const move: shogi.Move.Move = { type: "normal", from: clickFrom.from, to, promotion };
    const clone = _.cloneDeep(game);
    if (clone.move(move) instanceof Error) {
      // ???
      console.error(`illegal move: ${move} ${position}`);
    }
    updateGame(clone);
  };

  const handleHandClick = (piece: shogi.Piece.Piece) => {
    if (clickFrom !== undefined) {
      updateClickFrom(undefined, game);
      return;
    }

    const legalMoves = position.legalMoves();
    if (
      !legalMoves.some(
        (move) =>
          move.type === "drop" &&
          position.turn === shogi.Piece.color(piece) &&
          move.pieceType === shogi.Piece.pieceType(piece)
      )
    ) {
      updateClickFrom(undefined, game);
      return;
    }
    updateClickFrom({ type: "drop", piece }, game);
  };

  const handleKifuListClick = (nth: number) => {
    const clone = _.cloneDeep(game);
    if (clone.goToNth(nth) instanceof Error) {
      // ???
      console.error("goToNth");
      return;
    }
    updateGame(clone);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ShogiBoardWrapper>
        <div
          className="shogiboard"
          style={{
            display: "flex",
            flexDirection: "column",
            userSelect: "none",
            marginRight: 10,
          }}
        >
          <div>
            <Hand
              position={position}
              color={"w"}
              from={clickFrom?.type === "drop" ? clickFrom.piece : undefined}
              handleClick={handleHandClick}
            />
          </div>
          <div className="board" style={{ marginTop: 5, marginBottom: 5 }}>
            <Board
              position={position}
              from={clickFrom?.type === "normal" ? clickFrom.from : undefined}
              attack={attack}
              handleClick={handleBoardClick}
            />
          </div>
          <div>
            <Hand
              position={position}
              color={"b"}
              from={clickFrom?.type === "drop" ? clickFrom.piece : undefined}
              handleClick={handleHandClick}
            />
          </div>
        </div>
      </ShogiBoardWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginLeft: "auto", marginRight: "auto", marginBottom: 10 }}>
          <KifuList game={game} nth={calcNth(game)} handleClick={handleKifuListClick} />
        </div>
        <div
          className="goto_buttons"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              const clone = _.cloneDeep(game);
              clone.goToFirst();
              updateGame(clone);
            }}
          >
            {"|<"}
          </button>
          <button
            onClick={() => {
              const clone = _.cloneDeep(game);
              clone.prev();
              updateGame(clone);
            }}
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              const clone = _.cloneDeep(game);
              clone.next();
              updateGame(clone);
            }}
          >
            {">"}
          </button>
          <button
            onClick={() => {
              const clone = _.cloneDeep(game);
              clone.goToLast();
              updateGame(clone);
            }}
          >
            {">|"}
          </button>
        </div>
      </div>
    </div>
  );
};
