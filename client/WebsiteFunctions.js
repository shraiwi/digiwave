// TODO: add a website function where sending the required data to the server runs toggleDisplay()
// TODO: change the color of the buttons based on their ability to be pressed. if the button can be pressed, it should be #B4B4B4. otherwise, it should be "lightgray"

window.addEventListener("DOMContentLoaded", () => {
    var toggleMenuBtn = document.getElementById('toggleMenu');
    //document.getElementById('toggleMenu');
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
    });
});

function toggleDisplay() {
    var menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
