import React, {useEffect, useRef, useState} from "react";
import styles from "./ControlPanel.module.css";

function FlagsCounter({count}) {
    return (
        <p className="flag-counter">{count}</p>
    );
}

function Timer({start}) {
    return (
        <p className="timer">{start}</p>
    );
}

function ControlPanel({ bombs, onCPMount, resetGame}) {
    const [bombsMarked, setBombsMarked] = useState(0);
    const [status, setStatus] = useState('ready');
    const [seconds, setSeconds] = useState(0);
    const intervalIdRef = useRef(null);

    const readyStyle = {
        backgroundColor: '#ddd',
    }
    const startedStyle = {
        backgroundColor: '#888',
    }
    const finishedStyle = {
        backgroundColor: 'red',
    }
    const successStyle = {
        backgroundColor: 'green',
    }
    const [buttonStyle, setButtonStyle] = useState(readyStyle);

    useEffect(() => {
        onCPMount(setStatus, setBombsMarked);
    }, []);

    useEffect(() => {
        console.log('Control panel status changed to ' + status);
        if (status === 'started') {
            intervalIdRef.current = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
            setButtonStyle(startedStyle);
        } else if (status === 'finished') {
            clearInterval(intervalIdRef.current);
            setButtonStyle(finishedStyle);
        } else if (status === 'success') {
            clearInterval(intervalIdRef.current);
            setButtonStyle(successStyle);
        } else if (status === 'ready') {
            clearInterval(intervalIdRef.current);
            setSeconds(0);
            setButtonStyle(readyStyle);

        }
        return () => {
            clearInterval(intervalIdRef.current);
        }
    }, [status]);


    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let sec = seconds % 60;
        return `${minutes}:${String(sec).padStart(2, '0')}`;
    }

    return <div className="control-panel">
        <FlagsCounter count={(bombs - bombsMarked).toString()}/>
        <button className="reset-button" onClick={resetGame} style={buttonStyle}>Reset</button>
        <Timer start={formatTime(seconds)}/>
    </div>;
}

export default ControlPanel;
