import React from "react";
import { Board } from "./Board";
import { Hand } from "./Hand";
import { GameState, GameAction } from "./Game";
import { MoveData } from "shogi-lib";

export const ShogiBoard: React.FC<{ state: GameState; dispatch: React.Dispatch<GameAction> }> = ({
  state,
  dispatch,
}) => {
  const position = state.game.currentNode.position;
  const clickFrom = state.clickFrom;

  const lastToSq = MoveData.move(state.game.currentNode.lastMove)?.to;

  return (
    <div
      className="shogiboard"
      style={{
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      <div>
        <Hand
          position={position}
          color={"w"}
          from={clickFrom.type === "drop" ? clickFrom.piece : undefined}
          handleClick={(piece) => dispatch({ type: "clickHand", piece })}
        />
      </div>
      <div className="board" style={{ marginTop: 5, marginBottom: 5 }}>
        <Board
          position={position}
          from={clickFrom.type === "normal" ? clickFrom.from : undefined}
          attack={state.attackSquares}
          last={lastToSq}
          handleClick={(square) => dispatch({ type: "clickBoard", square })}
        />
      </div>
      <div>
        <Hand
          position={position}
          color={"b"}
          from={clickFrom.type === "drop" ? clickFrom.piece : undefined}
          handleClick={(piece) => dispatch({ type: "clickHand", piece })}
        />
      </div>
    </div>
  );
};
