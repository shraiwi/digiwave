window.addEventListener("load", function() {
    time = 0;
    this.document.getElementById("testing").innerHTML = "testing";
})

var interval = window.setInterval(command, 1000);

function command() {
    time++
    document.getElementById("testing").innerHTML = time;
}