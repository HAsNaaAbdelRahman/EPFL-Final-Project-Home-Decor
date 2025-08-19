let subtotal = 0;
const shippingCost = 20; 
let total = 0;

const checkoutForm = document.getElementById('checkout-form');
const placeOrderBtn = document.querySelector('.place-order');
const requiredInputs = checkoutForm.querySelectorAll('input[required], textarea[required]');

// === Validation Function ===
function validateInput(input) {
  const value = input.value.trim();
  const errorSpan = input.nextElementSibling;
  errorSpan.textContent = "";

  // Check empty
  if (!value) {
    errorSpan.textContent = "This field is required";
    return false;
  }

  // Email validation
  if (input.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorSpan.textContent = "Invalid email format";
      return false;
    }
  }

  // Phone validation (11 digits)
  if (input.id === "phone") {
    const phoneRegex = /^[0-9]{11}$/; 
    if (!phoneRegex.test(value)) {
      errorSpan.textContent = "Invalid phone number (format: 11 digits)";
      return false;
    }
  }

  // Full name validation
  if (input.id === "fullName") {
    if (value.length < 3) {
      errorSpan.textContent = "Name must be at least 3 characters long";
      return false;
    } else if (/[~`@#$%^*+=<>?/\\|.-]/.test(value)) {
      errorSpan.textContent = "Name cannot contain special characters";
      return false;
    }else if (/[0-9]/.test(value)) {
      errorSpan.textContent = "Name cannot contain digits";
      return false;
    }else if (value.split('').length < 0) {
      errorSpan.textContent = "Name cannot be empty";
      return false;
    }
  }

  // Address validation
  if (input.id === "address") {
    if (value.length < 5) {
      errorSpan.textContent = "Address too short";
      return false;
    } else if (/[~`@#$%^*+=<>?/\\|]/.test(value)) {
      errorSpan.textContent = "Address cannot contain special characters";
      return false;
    }
  }

  return true;
}


function validateForm() {
  let isValid = true;
  requiredInputs.forEach(input => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });

  placeOrderBtn.disabled = !isValid;
  placeOrderBtn.style.opacity = isValid ? '1' : '0.5';
  placeOrderBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';

  return isValid;
}

requiredInputs.forEach(input => {
  input.addEventListener('input', () => {
    validateInput(input);
    validateForm();
  });
});

placeOrderBtn.disabled = true;
placeOrderBtn.style.opacity = '0.5';
placeOrderBtn.style.cursor = 'not-allowed';

async function displayCart() {
  const tbody = document.getElementById('cart-items-table');
  const emptyDiv = document.getElementById('cart-empty');
  tbody.innerHTML = '';
  subtotal = 0;

  try {
    const response = await fetch('/get_cart_items');
    const result = await response.json();
    const products = result.cart || [];

    if (!products.length) {
      emptyDiv.style.display = 'block';
    } else {
      emptyDiv.style.display = 'none';
    }

    products.forEach(product => {
      const quantity = Number(product.quantity) || 1;
      const price = Number(product.price) || 0;
      const itemTotal = price * quantity;
      subtotal += itemTotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="cart-item-info">
            <img src="${product.thumbnail}" alt="${product.name}">
            <div>${product.name}</div>
          </div>
        </td>
        <td>x ${quantity}</td>
        <td>$${price.toFixed(2)}</td>
        <td>$${itemTotal.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    total = subtotal + shippingCost;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shippingCost.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4">Error fetching cart items.</td></tr>`;
  }
}

async function fetchCartFromBackend() {
  try {
    const response = await fetch('/get_cart_items');
    const result = await response.json();
    return result.cart || [];
  } catch (error) {
    return [];
  }
}

// === Place Order ===
async function placeOrder() {
  if (!validateForm()) {
    alert("Please fill all required fields correctly!");
    return;
  }

  const formData = new FormData(checkoutForm);
  const orderData = {
    customerInfo: Object.fromEntries(formData),
    cart: await fetchCartFromBackend(),
    subtotal: subtotal,
    shipping: shippingCost,
    total: total
  };

  try {
    const response = await fetch('/save_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await response.json();

    if (data.success) {
      showSuccessDialog();
      checkoutForm.reset();
      displayCart();
      placeOrderBtn.disabled = true;
      placeOrderBtn.style.opacity = '0.5';
      placeOrderBtn.style.cursor = 'not-allowed';
    } else {
      alert('Error placing order: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    alert('Error placing order.');
  }
}

function showSuccessDialog() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('successDialog').style.display = 'block';
}

function hideSuccessDialog() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('successDialog').style.display = 'none';
}

placeOrderBtn.addEventListener('click', function (e) {
  e.preventDefault();
  placeOrder();
});

displayCart();
