
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
    
    diagonal_lines(x, y, t) {
        return Math.sin((x + y) * 4.0 + t * 3.0) > 0.0;
    },
    
    spinning_lines(x, y, t) {
        const a = x * Math.cos(t * 0.1) + y * Math.sin(0.1);
        return Math.sin(a * 4.0 + t * 3.0) > 0.0;
    },
};

const CommandReceiver = {
    x: NaN,
    y: NaN,
    id: -1,
    
    serverConn: undefined,
    
    commandName: "off",
    commandCbId: undefined,
    commandStartTime: undefined,
    
    connectPromiseReject: undefined,
    connectPromiseResolve: undefined,
    
    seatPromiseReject: undefined,
    seatPromiseResolve: undefined,
    
    connectTo(url) {
        console.info(`connecting to ${url}...`);
        
        try {
            this.serverConn = new WebSocket(url);
        } catch (err) {
            this.connectPromiseReject(new Error("server connection error!"));
            this.serverConn = undefined;
        }
        
        this.serverConn.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            console.info("message recieved:", msg);
            switch (msg.type) {
                case "set_position":
                    // what to do if it gets data telling it its position (two floats)
                    this.x = msg.x;
                    this.y = msg.y;
                    this.id = msg.id;
                    
                    if (this.x === null && this.y === null) {
                        this.seatPromiseReject(new Error("invalid seat!"));
                    }
                    
                    if (this.id !== -1) {
                        this.seatPromiseResolve();
                    } else {
                        this.seatPromiseReject(new Error("too many clients!"));
                    }
                    break;
                case "set_command":
                    // what to do if it gets data telling it a command (single string)
                    if (msg.command in Commands) {
                        console.info(`running command "${msg.command}"`);
                        this.runCommand(msg.command);
                    } else {
                        console.error("recieved invalid command!");
                    }
                    break;
                default:
                    console.warn("Something went wrong. The client has recieved data in a type that is has not expected...");
                    break;
            }
        };
        
        this.serverConn.onopen = (e) => {
            this.connectPromiseResolve();
        };
        
        return new Promise((resolve, reject) => {
            this.connectPromiseResolve = resolve;
            this.connectPromiseReject = reject;
        });
    },
    
    setSeat(seatNum) {
        const retval = new Promise((resolve, reject) => {
            this.seatPromiseResolve = resolve;
            this.seatPromiseReject = reject;
        });
        
        if (this.serverConn) {
            this.serverConn.send(JSON.stringify({
                type: "get_position",
                seat: seatNum
            }));
        } else {
            this.seatPromiseReject(new Error("no active connection!"));
        }
        
        return retval;
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
        
        this.commandCbId = setInterval(() => { this.dispatchCommand() }, 100);
    },
}

