import React from "react";
import { Board } from "./Board";
import { Hand } from "./Hand";
import { GameState, GameAction } from "./Game";
import { MoveData } from "shogi-lib";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import isMobile from "ismobilejs";

export const ShogiBoard: React.FC<{ state: GameState; dispatch: React.Dispatch<GameAction> }> = ({
  state,
  dispatch,
}) => {
  const position = state.game.currentNode.position;
  const clickFrom = state.clickFrom;

  const lastToSq = MoveData.getMove(state.game.currentNode.lastMove)?.to;

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
        handleBoardDrop={(from, to) => dispatch({ type: "dragNormalMove", from, to })}
        handleHandDrop={(piece, to) => dispatch({ type: "dragDropMove", piece, to })}
      />
    </div>
  );

  return (
    // TODO: プレビューのカスタマイズ
    // TODO: Handの大きさは合ってるけど駒が小さい
    <DndProvider backend={isMobile().any ? TouchBackend : HTML5Backend}>
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
    </DndProvider>
  );
};
