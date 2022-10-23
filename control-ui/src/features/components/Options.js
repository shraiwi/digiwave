import React, { useState } from "react";
import "./Options.css"

const Options = (props) => {
    const client = props.client;
    const [message, setMessage] = useState('');
    const [speed, setSpeed] = useState('');

    const wave = () => {
        setMessage(`Wave (speed: ${speed}) Pending...`);
        client.send(JSON.stringify({type: "wave", speed: {speed}}));
    }

    const circle = () => {
        setMessage(`Circle (speed: ${speed}) Pending...`);
        client.send(JSON.stringify({type: "circle", speed: {speed}}));
    }

    const changeSpeed = event => {
        const result = event.target.value.replace(/\D/g, '');
        setSpeed(result);
    }

    //TODO: add more options and communicate to server
    return (
        <div class="options">
            <label for="speed">Speed:</label>
            <input type="text" value={speed} onChange={changeSpeed} name="speed"/>
            <div class="lights">
                <div class="light_item">
                    <div id="wrapper">
                        <div id="innerwrapper">
                            <div id="rectangle" />
                        </div>
                    </div>
                    <button onClick={() => wave()}>Wave</button>
                </div>
                <div class="light_item">
                    <div id="circlewrapper">
                        <div id="circle" />
                    </div>
                    <button onClick={() => circle()}>Circle</button>
                </div>  
            </div>
            
            <text>{message}</text>
        </div>
    );
}

export default Options;