// flashlight works only on android chrome, nothing else :(

const LightCommander = {
    videoTrack: null,

    torchState: undefined, // is null/true/false when ready
    
    // sets the torch state, either true or false.
    setTorch(on) {
        this.torchState = on;
                
        if (this.videoTrack) {
            this.videoTrack.applyConstraints({
                advanced: [{ torch: this.torchState }]
            });
        }
        
        if (this.torchPane) {
            const b = this.torchState ? 0xff : 0x00;
            this.torchPane.style.backgroundColor = `rgb(${b}, ${b}, ${b})`;
        }
    },
    
    // try to initialize the torch asynchronously
    // if no flashlight is available, fallback to using just the screen.
    async initTorch() {
        try {
            if ("mediaDevices" in navigator) { 
                // get a video track to control the torch. android only.
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter((device) => device.kind === 'videoinput');
                
                if (cameras.length === 0) {
                    throw "no camera found!";
                }
                
                const camera = cameras[cameras.length - 1]; // get last cam
                
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: camera.deviceId,
                        facingMode: ['user', 'environment'],
                        height: { ideal: 1 }, // get lowest possible res to reduce battery consumption
                        width: { ideal: 1 }
                    }
                });
                this.videoTrack = stream.getVideoTracks()[0]; // get first video track
            } else {
                throw "media api not accesible!";
            }
        } catch (err) {
            console.error(err);
            
            // fallback to screen flashlight
            this.torchPane = document.querySelector("#torchpane");
        }
        
        this.torchState = null;
    },
};


