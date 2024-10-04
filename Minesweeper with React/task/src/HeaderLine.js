import logo from "./resource/bomb.svg";
import React from "react";

export function HeaderLine() {
    return <div className="header-line">
        <h3 className="minesweeper-title">Minesweeper</h3>
        <img className="header-icon" src={logo} alt="logo"/>
    </div>;
}