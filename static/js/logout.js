const logoutButton = document.querySelector('.logout-button');

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = '/logout';  
});