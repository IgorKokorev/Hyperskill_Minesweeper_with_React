import React, {useEffect, useRef, useState} from "react";
import {HeaderLine} from "./HeaderLine";
import ControlPanel from "./ControlPanel/ControlPanel";
import {Field} from "./Field/Field";

const columns = 8;
const rows = 9;
const numMines = 10;
let field = [];

function createField() {
    console.log('Creating field...');
    field = [];

    function Cell() {
        this.isBomb = false;
        this.status = 'closed';
        this.bombAround = 0;
    }

// Creating a field
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            row.push(new Cell());
        }
        field.push(row);
    }

    function addBomb() {
        while (true) {
            let randomNumber = Math.floor(Math.random() * (rows * columns));
            let row = Math.floor(randomNumber / columns);
            let column = randomNumber % columns;
            if (field[row][column].isBomb) {
                continue;
            }
            field[row][column].isBomb = true;
            break;
        }
    }

// setting bombs
    for (let i = 0; i < numMines; i++) {
        addBomb();
    }

    function calculateBombsAround(row, column) {
        let numBombs = 0;
        for (let i = Math.max(row - 1, 0); i < Math.min(row + 2, rows); i++) {
            for (let j = Math.max(column - 1, 0); j < Math.min(column + 2, columns); j++) {
                if (((i !== row) || (j !== column)) && field[i][j].isBomb) {
                    numBombs++;
                }
            }
        }
        field[row][column].bombAround = numBombs;
    }

    // calculating bombs around
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            calculateBombsAround(row, column);
        }
    }
    return field;
}

export function Board() {
    const [field, setField] = useState(createField());
    const setCPStatus = useRef(null);
    const setCPBombMarks = useRef(null);
    const resetField = useRef(null);

    const onControlPanelMount = (setCPStatusCallback, setBombMarks) => {
        console.log('board on control panel mount CP status callback: ' + setCPStatusCallback);
        setCPStatus.current = setCPStatusCallback;
        console.log('set cp bomb marks callback: ' + setBombMarks)
        setCPBombMarks.current = setBombMarks;
    };

    const onFieldMount = (resetFieldCallback) => {
        resetField.current = resetFieldCallback;
    }

    const setStatus = (status) => {
        console.log('board set cp status ' + status);
        setCPStatus.current(status);
    }

    const setBombMarks = (n) => {
        console.log('setBombMarks: ' + n)
        setCPBombMarks.current(n);
    }

    const resetGame = () => {
        setField(() => createField());
        resetField.current();
    }

    return <div className="board">
        <HeaderLine/>
        <ControlPanel bombs={numMines} onCPMount={onControlPanelMount} resetGame={resetGame} />
        <Field field={field} rows={rows} columns={columns} bombs={numMines} setStatus={setStatus} setBombMarks={setBombMarks} onFieldMount={onFieldMount}/>
    </div>;
}