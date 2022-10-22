let x, y;
let command;
let time;

const CommandReceiver {
    x: NaN,
    y: NaN,
    id: -1,
    
    serverConn: undefined,
    
    command: "off",
    commandCb: undefined,
    
    connectTo(url) {
        this.serverConn = new WebSocket(url);
        
        this.serverConn.onmessage = (e) => {
            const msg = JSON.parse(event.data);
            switch (msg.type) {
                case "set_position":
                    // what to do if it gets data telling it its position (two floats)
                    this.x = msg.x;
                    this.y = msg.y;
                    break;
                case "set_command":
                    // what to do if it gets data telling it a command (single string)
                    if(serverComms.OPEN) {
                        this.command = msg.command;
                        resetTime();
                    } else {
                        this.command = "off";
                        console.warn("Recieved a command before connection is open. Command not activated.");
                    }
                    break;
                default:
                    console.error("Something went wrong. The client has recieved data in a type that is has not expected...");
                    break;
            }
        }
    }
}

/*var loc = window.location, new_uri;
if (loc.protocol === "https:") {
    new_uri = "wss:";
} else {
    new_uri = "ws:";
}
new_uri += "//" + loc.host;
new_uri += loc.pathname + "/to/ws";
const serverComms = new WebSocket(new_uri);

window.addEventListener("load", function() {
    interval = window.setInterval(applyCommand, 100);
});

serverComms.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
        case "set_position":
            // what to do if it gets data telling it its position (two floats)
            x = msg.x;
            y = msg.y;
            break;
        case "set_command":
            // what to do if it gets data telling it a command (single string)
            if(serverComms.OPEN) {
                command = msg.command;
                resetTime();
            } else {
                command = "";
                console.log("Recieved a command before connection is open. Command not activated.");
            }
            break;
        default:
            console.log("Something went wrong. The client has recieved data in a type that is has not expected...");
            break;
    }
}


function resetTime() {
    // reset the time
    time = 0.0;
}

function applyCommand(command) {
    //what to do when a command is sent in
    //todo: create an ontick method that checks the current command and applies it based on the time as well
    //base commands: wave_left, on, off, blink
    time += 0.1;
    switch (command) {
        case ("wave_left"):
            time_flash = x * 10 / 2.0;
            time_flash = Math.floor(time_flash * 10) / 10.0
            if(time == time_flash) {
                LightCommander.setTorch(true);
            } else {
                LightCommander.setTorch(false);
            }
            break;
        case ("on"):
            LightCommander.setTorch(true);
            break;
        case ("off"):
            LightCommander.setTorch(false);
            break;
        case ("blink"):
            LightCommander.setTorch(time % 2 == 0);
            break;
    }
}*/
