document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = loginForm.querySelector('input[type="submit"]');

    checkInitialAuthState();

    async function handleLogin(event) {
        event.preventDefault();
        
        loginButton.disabled = true;
        loginButton.value = 'login...';
        
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;
        
        if (!email || !password) {
            showError('Please fill in all fields');
            resetLoginButton();
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password 
                })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid server response');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error|| 'Login failed');
            }

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
            
        } catch (error) {
            resetLoginButton();
        }
    }

    function checkInitialAuthState() {
        const user = localStorage.getItem('user');
        if (user) {
            window.location.href = '/';
        }
    }

    function resetLoginButton() {
        loginButton.disabled = false;
        loginButton.value = ' login';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.className = 'error-message error';
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.className = 'error-message success';
        errorMessage.style.display = 'block';
    }

    loginForm.addEventListener('submit', handleLogin);
});

window.addEventListener('load', () => {
    localStorage.removeItem('user');
});
