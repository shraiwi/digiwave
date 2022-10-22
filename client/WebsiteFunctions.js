window.addEventListener("DOMContentLoaded", () => {
    var toggleMenuBtn = document.getElementById('toggleMenu');
    //document.getElementById('toggleMenu');
    toggleMenuBtn.addEventListener('click', function() {
        var menu = document.getElementById('menu');
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    });
    
    document.querySelector(".init").addEventListener("click", async () => {
        if (LightCommander.torchState === undefined) await LightCommander.initTorch();
        
        const urlParams = new URLSearchParams(window.location.search);
        const wsHost = (urlParams.has("a") && decodeURI(urlParams.get("a"))) 
            || window.location.host;
        
        const wsUrl = `ws://${wsHost}`;
        
        CommandReceiver.connectTo(wsUrl);
    });
});
