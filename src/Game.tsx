import React, { useReducer } from "react";
import * as shogi from "shogi-lib";
import _ from "lodash";
import styled from "styled-components";
import { KifuList } from "./KifuList";
import { ShogiBoard } from "./ShogiBoard";
import { KIFLoadTextArea } from "./KIFLoadTextArea";
import { moveDataToKIF } from "./util";

/** 合法手の中でfrom(駒を打つ場合はpiece)となり得るマスをクリックした状態 */
export type ClickFrom =
  | { type: "none" }
  | { type: "normal"; from: shogi.Square.Square }
  | { type: "drop"; piece: shogi.Piece.Piece };

export type GameState = {
  game: shogi.Game;
  clickFrom: ClickFrom;
  attackSquares: Array<shogi.Square.Square>;
  reverse: boolean;
};

export const initialGameState = (): GameState => {
  return { game: new shogi.Game(), clickFrom: { type: "none" }, attackSquares: [], reverse: false };
};

export type DragItem =
  | { type: "board"; from: shogi.Square.Square }
  | { type: "hand"; piece: shogi.Piece.Piece };

export type GameAction =
  | { type: "clickBoard"; square: shogi.Square.Square }
  | { type: "clickHand"; piece: shogi.Piece.Piece }
  // TODO: "dragBoard"、"dragHand"、"drop"に分ける
  | { type: "dragNormalMove"; from: shogi.Square.Square; to: shogi.Square.Square }
  | { type: "dragDropMove"; piece: shogi.Piece.Piece; to: shogi.Square.Square }
  | { type: "gotoNext" }
  | { type: "gotoPrev" }
  | { type: "gotoFirst" }
  | { type: "gotoLast" }
  | { type: "gotoUID"; uid: number }
  | { type: "loadKIF"; kif: string }
  | { type: "reverse" };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  const normalMove = (from: shogi.Square.Square, to: shogi.Square.Square): GameState => {
    const moves = state.game.currentNode.position
      .legalMoves()
      .filter((move) => move.type === "normal" && move.from === from && move.to === to);

    // 非合法手
    if (moves.length === 0) {
      return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
    }

    let promotion = false;
    if (moves.length === 1) {
      // 不成か強制成りかどちらか
      promotion = moves[0].type === "normal" && moves[0].promotion;
    } else if (moves.length === 2) {
      // 成か不成か選択する
      promotion = window.confirm("promote?");
    } else {
      // ???
      console.error("moves length should be 1 or 2");
    }
    const move: shogi.Move.Move = {
      type: "normal",
      from: from,
      to: to,
      promotion,
    };
    const clone = _.cloneDeep(state.game);
    const err = clone.move(move);
    if (err instanceof Error) console.error(err);
    return {
      ...state,
      game: clone,
      clickFrom: { type: "none" },
      attackSquares: [],
    };
  };

  const dropMove = (piece: shogi.Piece.Piece, to: shogi.Square.Square): GameState => {
    const pieceType = shogi.Piece.pieceType(piece);

    // クリックしたのが手番側の駒でなければ非合法手
    if (shogi.Piece.color(piece) !== state.game.currentNode.position.turn) {
      return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
    }
    // 非合法手
    if (
      !state.game.currentNode.position
        .legalMoves()
        .some((move) => move.type === "drop" && move.pieceType === pieceType)
    ) {
      return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
    }

    const move: shogi.Move.Move = { type: "drop", pieceType, to: to };
    const clone = _.cloneDeep(state.game);
    const err = clone.move(move);
    if (err instanceof Error) console.error(err);
    return {
      ...state,
      game: clone,
      clickFrom: { type: "none" },
      attackSquares: [],
    };
  };

  switch (action.type) {
    case "clickBoard": {
      const legalMoves = state.game.currentNode.position.legalMoves();
      switch (state.clickFrom.type) {
        case "none": {
          // 合法手の中でfromが一致している手
          const moves = legalMoves.filter(
            (move) => move.type === "normal" && move.from === action.square
          );
          // 非合法手
          if (moves.length === 0) {
            return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
          }
          return {
            ...state,
            clickFrom: { type: "normal", from: action.square },
            attackSquares: moves.map((move) => move.to),
          };
        }
        case "normal":
          return normalMove(state.clickFrom.from, action.square);
        case "drop":
          return dropMove(state.clickFrom.piece, action.square);
        default:
          // eslintが警告してくるので...
          console.error("unreachable");
          return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
      }
    }
    case "clickHand": {
      if (state.clickFrom.type !== "none") {
        return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
      }
      const legalMoves = state.game.currentNode.position.legalMoves();
      const moves = legalMoves.filter(
        (move) => move.type === "drop" && move.pieceType === shogi.Piece.pieceType(action.piece)
      );
      if (moves.length === 0) {
        return {
          ...state,
          clickFrom: { type: "none" },
          attackSquares: [],
        };
      }
      return {
        ...state,
        clickFrom: { type: "drop", piece: action.piece },
        attackSquares: moves.map((move) => move.to),
      };
    }
    case "dragNormalMove":
      return normalMove(action.from, action.to);
    case "dragDropMove":
      return dropMove(action.piece, action.to);
    case "gotoNext": {
      const clone = _.cloneDeep(state.game);
      clone.next();
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "gotoPrev": {
      const clone = _.cloneDeep(state.game);
      clone.prev();
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "gotoFirst": {
      const clone = _.cloneDeep(state.game);
      clone.gotoFirst();
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "gotoLast": {
      const clone = _.cloneDeep(state.game);
      clone.gotoLast();
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "gotoUID": {
      const clone = _.cloneDeep(state.game);
      const err = clone.gotoUID(action.uid);
      if (err instanceof Error) console.error(err);
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "loadKIF": {
      const game2 = shogi.Game.fromKIF(action.kif);
      if (game2 instanceof Error) {
        console.error(game2);
        return {
          ...state,
          clickFrom: { type: "none" },
          attackSquares: [],
        };
      }
      return {
        ...state,
        game: game2,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "reverse":
      return { ...state, reverse: !state.reverse };
  }
};

// よく分からない適当
// スクロールする必要がないようにぴったり合わせるには?
const ShogiBoardWrapper = styled.div`
  width: 100%;
  margin-right: 5px;

  @media (min-aspect-ratio: 99/100) {
    width: 66vh;
  }

  // @media (max-aspect-ratio: 99/100) {
  //   width: 66vw;
  // }
`;

export const Game = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState());

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <ShogiBoardWrapper>
        <ShogiBoard state={state} dispatch={dispatch} />
      </ShogiBoardWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <KifuList
            game={state.game}
            uid={state.game.currentNode.uid}
            handleClick={(uid) => dispatch({ type: "gotoUID", uid })}
          />
          <select
            value={state.game.currentNode.uid}
            disabled={state.game.currentNode.branch.length === 0}
            onChange={(e) => dispatch({ type: "gotoUID", uid: Number(e.target.value) })}
          >
            <option>変化{state.game.currentNode.branch.length}手</option>
            {state.game.currentNode.branch.map((node) => (
              <option key={node.uid} value={node.uid}>
                {moveDataToKIF(node.lastMove)}
              </option>
            ))}
          </select>
        </div>
        <GotoButtons dispatch={dispatch} />
        <KIFLoadTextArea
          handleClick={(kif: string) => {
            dispatch({ type: "loadKIF", kif });
          }}
        />
      </div>
    </div>
  );
};

export const GotoButtons: React.FC<{ dispatch: React.Dispatch<GameAction> }> = ({ dispatch }) => {
  return (
    <div
      className="goto_buttons"
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <button onClick={() => dispatch({ type: "gotoFirst" })}>{"|<"}</button>
      <button onClick={() => dispatch({ type: "gotoPrev" })}>{"<"}</button>
      <button onClick={() => dispatch({ type: "gotoNext" })}>{">"}</button>
      <button onClick={() => dispatch({ type: "gotoLast" })}>{">|"}</button>
      <button onClick={() => dispatch({ type: "reverse" })}>↑↓</button>
    </div>
  );
};
