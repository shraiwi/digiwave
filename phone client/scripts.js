const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

if (SUPPORTS_MEDIA_DEVICES) {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const cameras = devices.filter((device) => device.kind === 'videoinput');

        if(cameras.length === 0) {
            throw 'no camera found on this device.';
        }
        const camera = cameras[cameras.length - 1];

        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: camera.deviceId,
                facingMode: ['user', 'environment'],
                height: {ideal: 1080},
                width: {ideal: 1920}
            }
        }).then(stream => {
            const track = stream.getVideoTracks()[0];

            const imageCapture = new ImageCapture(track)
            const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {
                //todo: check if camera has a torch

                const btn = document.querySelector('.switch');
                btn.addEventListener('onClick', function() {
                    track.applyConstraints({
                        advanced: [{torch: true}]
                    });
                });
            });
        });
    });
}