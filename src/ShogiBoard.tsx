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
  const moveFrom = state.moveFrom;

  const lastToSq = MoveData.getMove(state.game.currentNode.lastMove)?.to;

  const bhand = (
    <div>
      <Hand
        position={position}
        color={"b"}
        from={moveFrom.type === "drop" ? moveFrom.piece : undefined}
        reverse={state.reverse}
        handleClick={(piece) => dispatch({ type: "clickHand", piece })}
        handleDragStart={(piece) => dispatch({ type: "dragHandStart", piece })}
        handleDragEnd={() => dispatch({ type: "dragEnd" })}
      />
    </div>
  );
  const whand = (
    <div>
      <Hand
        position={position}
        color={"w"}
        from={moveFrom.type === "drop" ? moveFrom.piece : undefined}
        reverse={state.reverse}
        handleClick={(piece) => dispatch({ type: "clickHand", piece })}
        handleDragStart={(piece) => dispatch({ type: "dragHandStart", piece })}
        handleDragEnd={() => dispatch({ type: "dragEnd" })}
      />
    </div>
  );
  const board = (
    <div className="board">
      <Board
        position={position}
        from={moveFrom.type === "normal" ? moveFrom.from : undefined}
        attack={state.attackSquares}
        last={lastToSq}
        reverse={state.reverse}
        handleClick={(square) => dispatch({ type: "clickBoard", square })}
        handleBoardDrop={(from, to) => dispatch({ type: "dragNormalMove", from, to })}
        handleHandDrop={(piece, to) => dispatch({ type: "dragDropMove", piece, to })}
        handleDragStart={(from) => dispatch({ type: "dragBoardStart", from })}
        handleDragEnd={() => dispatch({ type: "dragEnd" })}
      />
    </div>
  );

  return (
    // TODO: プレビューのカスタマイズ
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
