document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const inputs = {
        fullname: document.getElementById('fullname'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        address: document.getElementById('address'),
        phone: document.getElementById('phone'),
        security_question: document.getElementById('security_question')
    };

    const errorElements = {
        fullname: document.getElementById('fullname-error'),
        email: document.getElementById('email-error'),
        password: document.getElementById('password-error'),
        address: document.getElementById('address-error'),
        phone: document.getElementById('phone-error'),
        security_question: document.getElementById('security_question-error')
    };

    function validateFullName(name) {
        return name.trim().length >= 3;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function validateAddress(address) {
        return address.trim().length > 0;
    }

    function validatePhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(phone);
    }

    function validateSecurityAnswer(answer) {
        return answer.trim().length > 0;
    }

    function updateFormValidity() {
        let isValid = true;
        
        // Validate each field
        if (!validateFullName(inputs.fullname.value)) {
            errorElements.fullname.textContent = 'Full name must be at least 3 characters';
            errorElements.fullname.style.display = 'block';
            isValid = false;
        }

        if (!validateEmail(inputs.email.value)) {
            errorElements.email.textContent = 'Please enter a valid email';
            errorElements.email.style.display = 'block';
            isValid = false;
        }

        if (!validatePassword(inputs.password.value)) {
            errorElements.password.textContent = 'Password must be at least 6 characters';
            errorElements.password.style.display = 'block';
            isValid = false;
        }

        if (!validateAddress(inputs.address.value)) {
            errorElements.address.textContent = 'Please enter your address';
            errorElements.address.style.display = 'block';
            isValid = false;
        }

        if (!validatePhone(inputs.phone.value)) {
            errorElements.phone.textContent = 'Please enter a valid phone number (10-15 digits)';
            errorElements.phone.style.display = 'block';
            isValid = false;
        }

        if (!validateSecurityAnswer(inputs.security_question.value)) {
            errorElements.security_question.textContent = 'Please answer the security question';
            errorElements.security_question.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    Object.entries(inputs).forEach(([key, input]) => {
        input.addEventListener('input', () => {
            errorElements[key].style.display = 'none';
            input.classList.remove('error');
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!updateFormValidity()) return;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname: inputs.fullname.value,
                    email: inputs.email.value,
                    password: inputs.password.value,
                    address: inputs.address.value,
                    phone: inputs.phone.value,
                    security_question: inputs.security_question.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error && data.error.includes('Email already exists')) {
                    errorElements.email.textContent = data.error;
                    errorElements.email.style.display = 'block';
                    inputs.email.classList.add('error');
                }
                throw new Error(data.error || 'Registration failed');
            }

            if (data.id) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Signup Error:', error);
            alert(error.message || 'An error occurred during registration');
        }
    });
});