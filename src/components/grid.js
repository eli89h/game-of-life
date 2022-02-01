import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const cellOperationsConway = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const Grid = () => {
  const [colAndRows, setColAndRows] = useState(10);
  const numRows = colAndRows;
  const numCols = colAndRows;

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  };

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runGame = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighborCells = 0;
            cellOperationsConway.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              //check boundaries
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighborCells += g[newI][newJ];
              }
            });

            if (neighborCells < 2 || neighborCells > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighborCells === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runGame, 500);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() < 0.3 ? 1 : 0))
              );
            }
            setGrid(rows);
            runningRef.current = true;
            runGame();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 40px)`,
          // gridTemplateRows: `repeat(${numRows}, 40px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 40,
                height: 40,
                backgroundColor: grid[i][j] ? "green" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Grid;
