const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav-links');

if (menuBtn && navLinks) {
    const menuBtnIcon = menuBtn.querySelector('i');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuBtnIcon.className = navLinks.classList.contains('open') ? 'ri-close-line' : 'ri-menu-line';
    });

    document.querySelectorAll('.nav__links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuBtnIcon.className = 'ri-menu-line';
        });
    });
}

function checkAuth() {
    const user = localStorage.getItem('user');
    const userIcon = document.querySelector('.ri-user-line');
    
    if (user) {
        const userData = JSON.parse(user);
        if (userIcon) {
            userIcon.closest('a').href = '/profile';
            userIcon.closest('a').querySelector('i').className = 'ri-user-fill'; // تغيير الأيقونة عند التسجيل
        }
    } else {
        if (userIcon) {
            userIcon.closest('a').href = '/login';
        }
    }
}
checkAuth();

const user = localStorage.getItem('user');
if (user) {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'logout-btn';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    });


}