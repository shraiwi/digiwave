
const Commands = {
    on(x, y, time) { return true; },
    off(x, y, time) { return false; },
    
    blink(x, y, time) {
        return (time % 2.0) > 1.0;
    },
    
    wave_left(x, y, time) {
        timeFlash = x * 10.0 / 2.0;
        timeFlash = Math.floor(time_flash * 10.0) / 10.0;
        
        return time == timeFlash;
    },
}

const CommandReceiver = {
    x: NaN,
    y: NaN,
    id: -1,
    
    serverConn: undefined,
    
    commandName: "off",
    commandCbId: undefined,
    commandStartTime: undefined,
    
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
                    if (msg.command in Commands) {
                        this.runCommand(msg.command);
                    } else {
                        console.error("recieved invalid command!");
                    }
                    break;
                default:
                    console.warn("Something went wrong. The client has recieved data in a type that is has not expected...");
                    break;
            }
        }
    },
    
    dispatchCommand() {
        const time = (performance.now() - this.commandStartTime) * 0.001;
        LightCommander.setTorch(
            Commands[this.commandName](this.x, this.y, time)
        );
    },
    
    runCommand(cmd) {
        if (this.commandCbId) clearInterval(this.commandCbId);
        this.commandName = cmd;
        this.commandStartTime = performance.now();
        
        this.dispatchCommand();
        
        this.commandCbId = setInterval(() => { this.dispatchCommand() }, 500);
    },
}

