window.onload = function() {
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
}
