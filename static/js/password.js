document.addEventListener('DOMContentLoaded', function () {
      const form = document.getElementById('forgetForm');
      const emailInput = form.querySelector('input[name="email"]');
      const secInput = form.querySelector('input[name="security_question"]');
      const errorSpan = document.getElementById('server-error');

      //  validators
      function isValidEmail(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return re.test(value.trim());
      }
      function isValidSecurity(value) {
        return value.trim().length >= 3;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault(); 

        if (!isValidEmail(emailInput.value) || !isValidSecurity(secInput.value)) {
          errorSpan.textContent = "Please enter a valid email and a security answer with at least 3 characters.";
          return;
        }

        fetch("/forget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value.trim(),
            security_question: secInput.value.trim()
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            window.location.href = data.redirect; 
          } else {
            errorSpan.textContent = data.error;
          }
        })
        .catch(err => {
          console.error(err);
          errorSpan.textContent = "Something went wrong. Please try again.";
        });
      });
    });
