document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
  });
});
document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menu_btn");
    const navLinks = document.getElementById("nav-links");

    if (menuBtn && navLinks) {
        const menuBtnIcon = menuBtn.querySelector("i");

        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            const isOpen = navLinks.classList.contains("open");
            menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
        });

        navLinks.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuBtnIcon.setAttribute("class", "ri-menu-line");
        });
    }

});
