async function handleLogout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            localStorage.removeItem('user');
            sessionStorage.clear();
            
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

const logoutBtn = document.querySelector('[href="/logout"]');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleLogout();
    });
}