const menuBtn = document.getElementById('menu_btn');
const navLinks = document.getElementById('nav-links');


document.addEventListener("DOMContentLoaded", function() {
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.querySelector(".user-icon");
    const shopNowBtn = document.querySelector('.shop__btn');
    const learnMoreBtn = document.querySelector('.learn__more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            window.location.href = '/about';
        });
    }
 
    // =========== User Dropdown Functionality ===========

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
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            window.location.href = '/products';
        });
    }

    const moreBtn = document.querySelector('.more__btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            window.location.href = '/products';
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
    const shopNowBtn = document.querySelector('.shop__btn');
    
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            window.location.href = '/products';
        });
    }
});
    
});

    // =========== Navbar Menu Button Functionality ===========

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

// =========== Check Authentication and Update User Icon ===========


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

