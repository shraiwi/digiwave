const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

// works only on android chrome, nothing else :(

const LightCommander = {
    videoTrack: null,
    
    commandCb: undefined,

    torchState: undefined, // is boolean when ready
    
    setTorch(on) {
        this.torchState = on;
                
        if (this.videoTrack) {
            this.videoTrack.applyConstraints({
                advanced: [{ torch: this.torchState }]
            });
        }
        
        if (this.torchPane) {
            this.torchPane.style.setProperty("--torch", 1 - this.torchState);
        }
    },
    
    async initTorch() {
        try {
            if ("mediaDevices" in navigator) {
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
            
            // fallback to screen api
            this.torchPane = document.querySelector("#torchpane");
        }
        
        //this.torchState = false;
        this.setTorch(false);
    },
    
    setCommand() {
        
    }
};

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".init").addEventListener("click", async () => {
        if (LightCommander.torchState === undefined) await LightCommander.initTorch();
        
        const btn = document.querySelector('.switch');

        btn.addEventListener('click', () => {
            LightCommander.setTorch(!LightCommander.torchState);
        });
        btn.disabled = false;
    });
});



