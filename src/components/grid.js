import React, { useState, useCallback, useRef, useEffect } from "react";
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
  const [numRows, setNumRows] = useState(10);
  const [numCols, setNumCols] = useState(10);
  const [random, setRandom] = useState(0.3);
  const [delay, setDelay] = useState(500);

  const [colAndRowsOptions] = useState([
    { label: "6x6", value: 6 },
    { label: "8x8", value: 8 },
    { label: "10x10", value: 10 },
    { label: "15x15", value: 15 },
    { label: "20x20", value: 20 },
    { label: "30x30", value: 30 },
    { label: "50x50", value: 50 },
    { label: "75x75", value: 75 },
    { label: "100x100", value: 100 },
  ]);

  const [randomOptions] = useState([
    { label: "Low", value: 0.1 },
    { label: "Medium", value: 0.3 },
    { label: "Large", value: 0.5 },
  ]);

  const [speedOptions] = useState([
    { label: "Very Slow", value: 2000 },
    { label: "Slow", value: 1000 },
    { label: "Normal", value: 500 },
    { label: "Fast", value: 200 },
    { label: "Very Fast", value: 10 },
  ]);

  // const generateGrid = () => {
  //   const rows = [];
  //   for (let i = 0; i < numRows; i++) {
  //     rows.push(Array.from(Array(numCols), () => 0));
  //   }

  //   return rows;
  // };

  const randomGrid = () => {
    const myGrid = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(Math.random() < random ? 1 : 0);
      }
      myGrid.push(row);
    }
    return myGrid;
  };

  const handleRowsColsChange = (newValue) => {
    setNumRows(newValue);
    setNumCols(newValue);
    setRunning(false);
  };

  const handleRandomChange = (newValue) => {
    setRandom(newValue);
    setRunning(false);
  };
  const handleDelayChange = (newValue) => {
    setDelay(newValue);
    setRunning(false);
  };

  const [grid, setGrid] = useState(() => {
    return randomGrid();
  });

  useEffect(() => {
    setGrid(randomGrid());
  }, [numRows]);

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

    setTimeout(runGame, delay);
  }, [numRows, random, delay]);

  return (
    <>
      <div>
        <span>Change rows and comlumns size:</span>
        <select
          onChange={(e) => handleRowsColsChange(e.target.value)}
          value={(numRows, numCols)}
        >
          {colAndRowsOptions.map((item) => (
            <option
              selected={item.label === "10x10"}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <span>Change number of random cells:</span>
        <select
          onChange={(e) => handleRandomChange(e.target.value)}
          value={random}
        >
          {randomOptions.map((item) => (
            <option
              selected={item.label === "Medium"}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <span>Change the speed of generations:</span>
        <select
          onChange={(e) => handleDelayChange(e.target.value)}
          value={delay}
        >
          {speedOptions.map((item) => (
            <option
              selected={item.label === "Normal"}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            setGrid(randomGrid());
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
        }}
      >
        {grid &&
          grid.map(
            (rows, i) =>
              rows &&
              rows.map((col, j) => (
                <div
                  key={`${i}-${j}`}
                  onClick={() => {
                    let newGrid = produce(grid, (gridCopy) => {
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
