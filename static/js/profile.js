document.addEventListener('DOMContentLoaded' , () => {
    const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            document.getElementById('profile-info').innerHTML = `
            <p><span class="label">Name: </span>${user.name}</p>
            <p><span class="label">Email: </span>${user.email}</p>
            <p><span class="label">Phone: </span>${user.phone}</p>
            <p><span class="label">Address: </span>${user.address}</p>

            `;
        }else {
            document.getElementById('profile-info').innerHTML = `
           <p class= "error"> user data not found</p>

            `;
        }
})

