import {Cell} from "../Cell/Cell";
import React, {useEffect, useState} from "react";
import styles from "./Field.module.css"

export function Field({field, rows, columns, bombs, setStatus, setBombMarks, onFieldMount}) {

    const [cells, setCells] = useState([]);
    const [gameStatus, setGameStatus] = useState('ready');
    const [numFlags, setNumFlags] = useState(0);

    const cellSize = 20;
    const cellPadding = 3;

    function saveNewCell(i, j, cell) {
        let newCells = [...cells];
        newCells[i][j] = cell;
        setCells(newCells);
    }

    function resetField() {
        setGameStatus("ready");
        setNumFlags(0);
    }

    useEffect(() => {
        setCells(field);
    }, [field]);

    useEffect(() => {
        onFieldMount(resetField);
    }, []);

    useEffect(() => {
        setStatus(gameStatus);
    }, [gameStatus]);

    useEffect(() => {
        setBombMarks(numFlags);
    }, [numFlags]);

    function openCellsAround(row, column) {
        for (let i = Math.max(row - 1, 0); i < Math.min(row + 2, rows); i++) {
            for (let j = Math.max(column - 1, 0); j < Math.min(column + 2, columns); j++) {
                if ((i !== row) || (j !== column)) {
                    cellClick(i, j);
                }
            }
        }
    }

    function checkBoard() {
        let finished = true;
        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
                if (cells[i][j].status === 'closed') {
                    finished = false;
                    break;
                }
            }
            if (!finished) { break; }
        }
        if (finished) {setGameStatus('success')}
    }

    function cellClick(i, j) {
        if (gameStatus === 'finished' || gameStatus === 'success') return;
        if (gameStatus === 'ready') {
            setGameStatus('started');
        }

        let cell = cells[i][j];

        if (cell.status === 'open') return;

        if (cell.isBomb) {
            cell.status = 'fired';
            setGameStatus('finished');
        } else {
            cell.status = 'open';
            if (cell.bombAround === 0) {
                openCellsAround(i, j);
            }
            checkBoard();
        }
        saveNewCell(i, j, cell);
    }

    function cellRightClick(i, j) {
        if (gameStatus === 'finished' || gameStatus === 'success') return;
        let cell = cells[i][j];
        if (cell.status === 'open') return;
        if (cell.status === 'closed' && numFlags < bombs) {
            cell.status = 'flagged';
            setNumFlags((n) => n + 1);
        } else if (cell.status === 'flagged') {
            cell.status = 'closed';
            setNumFlags((n) => n - 1);
        }
        checkBoard();
        saveNewCell(i, j, cell);
    }

    return (<div
        className="field"
        style={{
            width: columns * (cellSize + cellPadding) - cellPadding,
            height: rows * (cellSize + cellPadding) - cellPadding
        }}>
        {cells.map((row, i) => <>
            {row.map((cell, j) => (
                <Cell
                    cell={cell}
                    handleClick={() => cellClick(i, j)}
                    handleRightClick={() => cellRightClick(i, j)}
                />
            ))}
        </>)
        }
    </div>);
}