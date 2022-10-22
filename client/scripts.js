const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

// works only on android chrome, nothing else :(

const LightCommander = {
    videoTrack: null,
    
    commandCb: undefined,

    torchState: undefined, // is boolean when ready
    
    async initTorch() {
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
    
            const imageCapture = new ImageCapture(this.videoTrack);
            const photoCapabilities = await imageCapture.getPhotoCapabilities();
            
            this.setTorch = (on) => {
                this.torchState = on;
                this.videoTrack.applyConstraints({
                    advanced: [{ torch: this.torchState }]
                });
            };
            this.torchState = false;

            const btn = document.querySelector('.switch');
            
            btn.addEventListener('click', () => {
                this.setTorch(!this.torchState);
            });
            btn.disabled = false;
        } else {
            throw "media api not accesible!";
        }
    },
    
    setCommand() {
        
    }
};

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".init").addEventListener("click", async () => {
        LightCommander.initTorch();
    });
});