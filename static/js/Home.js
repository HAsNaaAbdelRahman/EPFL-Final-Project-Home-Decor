const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav-links');


document.addEventListener("DOMContentLoaded", function() {
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.querySelector(".user-icon");

    if (userDropdown) {
        userIcon.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = this.closest('.user-dropdown').querySelector('.dropdown-menu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener("click", function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.querySelector('.dropdown-menu').style.display = 'none';
            }
        });
    }
});

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
            userIcon.closest('a').querySelector('i').className = 'ri-user-fill'; 
        }
    } else {
        if (userIcon) {
            userIcon.closest('a').href = '/login';
            userIcon.closest('a').querySelector('i').className = 'ri-user-line'; 

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

