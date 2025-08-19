    const form = document.getElementById("resetForm");
    const newPass = document.getElementById("new_password");
    const confirmPass = document.getElementById("confirm_password");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", function (event) {
      errorMessage.textContent = "";

      if (newPass.value.trim() !== confirmPass.value.trim()) {
        event.preventDefault(); 
        errorMessage.textContent = "Passwords do not match!";
        confirmPass.focus(); 
        return;
      }

      if (newPass.value.trim().length < 6 || !/[~`@#$%^*+=<>?/\\|]/.test(newPass.value) || !/[a-z]/.test(newPass.value) || !/[A-Z]/.test(newPass.value) || !/[0-9]/.test(newPass.value)) {
        event.preventDefault();
        errorMessage.textContent = "Password must be at least 6 characters,  at least one  uppercase, one lowercase, one digit, and one special character.";
        newPass.focus();
        return;
      }
    });
