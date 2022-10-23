window.addEventListener("DOMContentLoaded", async () => {
    const menuDiv = document.getElementById("menu");
    const seatNumInput = document.getElementById("seatNum");
    const initBtn = document.getElementById("init");
    
    initBtn.addEventListener("click", async () => {
        // initialize torch
        if (LightCommander.torchState === undefined) await LightCommander.initTorch();
        
        // parse search params to get websockets host, otherwise default to the current domain.
        const urlParams = new URLSearchParams(window.location.search);
        const wsHost = (urlParams.has("a") && decodeURI(urlParams.get("a"))) 
            || window.location.host;
        
        const wsUrl = `ws://${wsHost}`;
        
        // try to connect to the server
        try {
            seatNumInput.disabled = true;
            initBtn.disabled = true;
            initBtn.innerText = "Connecting...";
            await CommandReceiver.connectTo(wsUrl);
            await CommandReceiver.setSeat(seatNumInput.value);
            
            // connection was good, hide menu and ready controls
            menuDiv.style.display = 'none';
            document.body.style.backgroundImage = "none";
            LightCommander.setTorch(false);
            LightCommander.torchPane.innerHTML = "you're all set.</br>this side should be facing the venue!";
        } catch (err) {
            // on error, restart state and alert the user of the error
            seatNumInput.disabled = false;
            initBtn.disabled = false;
            initBtn.innerText = "Go";
            alert("Error while connecting: " + err.message);
            console.warn(err);
        }
    });
});
