import React, {useState} from 'react';
import style from './Cell.module.css';
import targetImg from '../resource/target.svg'
import firedImg from '../resource/fired.svg'

export function Cell({cell, handleClick, handleRightClick}) {

    const closedStyle = {
        backgroundColor: 'grey',
        boxShadow: '2px 2px 2px #ccc'
    };

    const openStyle = {
        backgroundColor: 'lightgrey',
        // boxShadow: '2px 2px 3px #aaa'
    };

    const flaggedStyle = {
        backgroundColor: 'grey',
        backgroundImage: `url(${targetImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        boxShadow: '0 0 5px #800'
    }

    const firedStyle = {
        backgroundColor: 'red',
        backgroundImage: `url(${firedImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        boxShadow: '0 0 5px #800'
    }

    const style = cell.status === 'closed' ? closedStyle :
        (cell.status === 'fired' ? firedStyle :
        (cell.status === 'flagged' ? flaggedStyle : openStyle));

    return (
        <div
            className="cell"
            style={style}
            onClick={handleClick}
            onContextMenu={handleRightClick}>
            { cell.status === 'open' && cell.bombAround > 0 && cell.bombAround }
        </div>
    );
}