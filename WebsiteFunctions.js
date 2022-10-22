const menuToggleBtn = document.getElementById("#menuToggle");
const menu = document.getElementById("#menu");

menuToggleBtn.addEventListener("click", (event) => function() {
    if (menu.style.display == 'none') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
});