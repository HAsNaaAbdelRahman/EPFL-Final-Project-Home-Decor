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
    // ======================== Validation Functions ========================

    function validateFullName(name) {
        if(name.trim() === '') {
            return false;
        }
        if(name.includes('@#$%^&*()_+={}[]|\\;:\'",<>?`~')) {
            return false;
        }
        return name.trim().length >= 7;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        if(password.trim() === '') {
            return false;
        }
        return password.length >= 6;
    }

    function validateAddress(address) {
        if(address.trim() === '') {
            return false;
        }
        if(address.includes('@#$%^&*()_+={}[]|\\;:\'",<>?`~')) {
            return false;
        }

        return address.length > 3 ;
    }

    function validatePhone(phone) {
        const re = /^[0-9]{11}$/;
        return re.test(phone);
    }

    function validateSecurityAnswer(answer) {

        if(answer.trim() === '') {
            return false;
        }
        if(answer.includes('@#$%^&*()_+={}[]|\\;:\'",<>?`~')) {
            return false;
        }

        return answer.trim().length > 3;
    }

    function updateFormValidity() {
        let isValid = true;
        
        if (!validateFullName(inputs.fullname.value)) {
            errorElements.fullname.textContent = 'Full name must be at least 7 characters long and cannot contain special characters.';
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
            errorElements.address.textContent = 'Please enter your address must be at least characters and avoid special characters and any spaces.';
            errorElements.address.style.display = 'block';
            isValid = false;
        }

        if (!validatePhone(inputs.phone.value)) {
            errorElements.phone.textContent = 'Please enter a valid phone number (11 digits)';
            errorElements.phone.style.display = 'block';
            isValid = false;
        }

        if (!validateSecurityAnswer(inputs.security_question.value)) {
            errorElements.security_question.textContent = 'Please answer the security question (3 characters minimum) and avoid special characters.';
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
                }else {
                errorElements.email.textContent = data.error || 'Registration failed';
                errorElements.email.style.display = 'block';
                }
                return;
            }

            if (data.id) {
                window.location.href = '/login';
            }
        } catch (error) {
                errorElements.email.textContent = 'Something went wrong, please try again later';
                errorElements.email.style.display = 'block';
        }
    });
});