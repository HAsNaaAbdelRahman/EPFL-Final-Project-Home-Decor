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

      if (newPass.value.trim().length < 6) {
        event.preventDefault();
        errorMessage.textContent = "Password must be at least 6 characters long!";
        newPass.focus();
        return;
      }
    });
