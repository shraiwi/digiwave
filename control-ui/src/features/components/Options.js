import React, { useState } from "react";
import "./Options.css"

const Options = () => {
    const [message, setMessage] = useState('');

    function wave() {
        setMessage("Pending...");
    }

    //TODO: add more options and communicate to database
    return (
        <div class="options">
            <div id="wrapper">
                <div id="innerwrapper">
                    <div id="rectangle" />
                </div>
            </div>
            <button onClick={() => wave()}>Wave</button>
            <text>{message}</text>
        </div>
    );
}

export default Options;