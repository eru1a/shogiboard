import React, { useReducer } from "react";
import * as shogi from "shogi-lib";
import _ from "lodash";
import styled from "styled-components";
import { KifuList } from "./KifuList";
import { ShogiBoard } from "./ShogiBoard";
import { KIFLoadTextArea } from "./KIFLoadTextArea";

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

export type GameAction =
  | { type: "clickBoard"; square: shogi.Square.Square }
  | { type: "clickHand"; piece: shogi.Piece.Piece }
  | { type: "gotoNext" }
  | { type: "gotoPrev" }
  | { type: "gotoFirst" }
  | { type: "gotoLast" }
  | { type: "gotoNth"; nth: number }
  | { type: "loadKIF"; kif: string }
  | { type: "reverse" };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
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
        case "normal": {
          const from = state.clickFrom.from;
          const moves = legalMoves.filter(
            (move) => move.type === "normal" && move.from === from && move.to === action.square
          );

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
          const move: shogi.Move.Move = { type: "normal", from, to: action.square, promotion };
          const clone = _.cloneDeep(state.game);
          const err = clone.move(move);
          if (err instanceof Error) console.error(err);
          return {
            ...state,
            game: clone,
            clickFrom: { type: "none" },
            attackSquares: [],
          };
        }
        case "drop": {
          const piece = state.clickFrom.piece;
          const pieceType = shogi.Piece.pieceType(piece);

          // クリックしたのが手番側の駒でなければ非合法手
          if (shogi.Piece.color(piece) !== state.game.currentNode.position.turn) {
            return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
          }
          // 非合法手
          if (!legalMoves.some((move) => move.type === "drop" && move.pieceType === pieceType)) {
            return { ...state, clickFrom: { type: "none" }, attackSquares: [] };
          }

          const move: shogi.Move.Move = { type: "drop", pieceType, to: action.square };
          const clone = _.cloneDeep(state.game);
          const err = clone.move(move);
          if (err instanceof Error) console.error(err);
          return {
            ...state,
            game: clone,
            clickFrom: { type: "none" },
            attackSquares: [],
          };
        }
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
      clone.goToFirst();
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "gotoLast": {
      const clone = _.cloneDeep(state.game);
      clone.goToLast();
      return {
        ...state,
        game: clone,
        clickFrom: { type: "none" },
        attackSquares: [],
      };
    }
    case "gotoNth": {
      const clone = _.cloneDeep(state.game);
      const err = clone.goToNth(action.nth);
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
  @media (min-aspect-ratio: 686/1000) {
    width: 66vh;
  }

  @media (max-aspect-ratio: 686/1000) {
    width: 66vw;
  }
`;

export const Game = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState());

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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ marginRight: 10 }}>
        <ShogiBoardWrapper>
          <ShogiBoard state={state} dispatch={dispatch} />
        </ShogiBoardWrapper>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginLeft: "auto", marginRight: "auto", marginBottom: 10 }}>
          <KifuList
            game={state.game}
            nth={calcNth(state.game)}
            handleClick={(nth) => dispatch({ type: "gotoNth", nth })}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <GotoButtons dispatch={dispatch} />
        </div>
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
