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

  const bhand = (
    <div>
      <Hand
        position={position}
        color={"b"}
        from={clickFrom.type === "drop" ? clickFrom.piece : undefined}
        reverse={state.reverse}
        handleClick={(piece) => dispatch({ type: "clickHand", piece })}
      />
    </div>
  );
  const whand = (
    <div>
      <Hand
        position={position}
        color={"w"}
        from={clickFrom.type === "drop" ? clickFrom.piece : undefined}
        reverse={state.reverse}
        handleClick={(piece) => dispatch({ type: "clickHand", piece })}
      />
    </div>
  );
  const board = (
    <div className="board">
      <Board
        position={position}
        from={clickFrom.type === "normal" ? clickFrom.from : undefined}
        attack={state.attackSquares}
        last={lastToSq}
        reverse={state.reverse}
        handleClick={(square) => dispatch({ type: "clickBoard", square })}
      />
    </div>
  );

  return (
    <div
      id="shogiboard"
      style={{
        display: "grid",
        gridTemplateRows: "1fr 9fr 1fr",
        userSelect: "none",
        gridRowGap: 5,
        boxSizing: "border-box",
      }}
    >
      {state.reverse ? bhand : whand}
      {board}
      {state.reverse ? whand : bhand}
    </div>
  );
};
