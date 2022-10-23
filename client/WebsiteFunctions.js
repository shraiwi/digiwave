window.addEventListener("DOMContentLoaded", () => {
    var toggleMenuBtn = document.getElementById('toggleMenu');
    toggleMenuBtn.addEventListener('click', function() {
        toggleDisplay();
    });
    
    document.querySelector(".init").addEventListener("click", async () => {
        if (LightCommander.torchState === undefined) await LightCommander.initTorch();
        
        const urlParams = new URLSearchParams(window.location.search);
        const wsHost = (urlParams.has("a") && decodeURI(urlParams.get("a"))) 
            || window.location.host;
        
        const wsUrl = `ws://${wsHost}`;
        
        CommandReceiver.connectTo(wsUrl);
        
        // hide menu
        const menu = document.getElementById('menu');
        menu.style.display = 'none';
        
        // clear body background
        document.body.style.backgroundImage = "none";
    });
});

function toggleDisplay() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
