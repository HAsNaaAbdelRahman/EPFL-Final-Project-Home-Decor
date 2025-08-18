let subtotal = 0;
const shippingCost = 20; 
let total = 0;

const checkoutForm = document.getElementById('checkout-form');
const placeOrderBtn = document.querySelector('.place-order');
const requiredInputs = checkoutForm.querySelectorAll('input[required], textarea[required]');

placeOrderBtn.disabled = true;
placeOrderBtn.style.opacity = '0.5';
placeOrderBtn.style.cursor = 'not-allowed';

function validateForm() {
  let isValid = true;
  let emptyFields = [];

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      emptyFields.push(input.getAttribute('placeholder'));
    }
  });

  if (isValid) {
    placeOrderBtn.disabled = false;
    placeOrderBtn.style.opacity = '1';
    placeOrderBtn.style.cursor = 'pointer';
  } else {
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.opacity = '0.5';
    placeOrderBtn.style.cursor = 'not-allowed';
  }

  return { isValid, emptyFields };
}

requiredInputs.forEach(input => {
  input.addEventListener('input', validateForm);
});

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

async function placeOrder() {
  const validation = validateForm();

  if (!validation.isValid) {
    alert("Please fill all required fields!");
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
      // clear form after successful order
      checkoutForm.reset();

      placeOrderBtn.disabled = true;
      placeOrderBtn.style.opacity = '0.5';
      placeOrderBtn.style.cursor = 'not-allowed';

      document.getElementById('cart-items-table').innerHTML = '';
      document.getElementById('subtotal').textContent = '$0.00';
      document.getElementById('shipping').textContent = '$20.00';
      document.getElementById('total').textContent = '$0.00';

      document.getElementById('cart-empty').style.display = 'block';
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


function closePopup() {
  document.getElementById("successPopup").style.display = "none";
}