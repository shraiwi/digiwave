window.addEventListener("DOMContentLoaded", async () => {
    /*var toggleMenuBtn = document.getElementById('toggleMenu');
    toggleMenuBtn.addEventListener('click', function() {
        toggleDisplay();
    });*/
    
    const menuDiv = document.getElementById("menu");
    const seatNumInput = document.getElementById("seatNum");
    const initBtn = document.getElementById("init");
    
    initBtn.addEventListener("click", async () => {
        if (LightCommander.torchState === undefined) await LightCommander.initTorch();
        
        const urlParams = new URLSearchParams(window.location.search);
        const wsHost = (urlParams.has("a") && decodeURI(urlParams.get("a"))) 
            || window.location.host;
        
        const wsUrl = `ws://${wsHost}`;

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
            seatNumInput.disabled = false;
            initBtn.disabled = false;
            initBtn.innerText = "Go";
            alert("Error while connecting: " + err.message);
            console.warn(err);
        }
    });
});

function toggleDisplay() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
