async function fetchCartItems() {
    try {
        const response = await fetch('/get_cart_items');
        const data = await response.json();
        if (response.ok && data.cart) {
            displayCartItems(data.cart, data.subtotal);
        } else {
            displayCartItems([], 0);
        }
    } catch (error) {
        displayCartItems([], 0);
    }
}



function displayCartItems(cartItems, subtotal) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (!cartItems || cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
        disableCheckoutButton();
        updateCartTotals(0);
        return;
    }

    enableCheckoutButton();

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="cart__product">
                <img src="${item.thumbnail}" alt="${item.name}">
                <span>${item.name}</span>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" min="1" max="1000" value="${item.quantity}" class="cart-quantity" data-id="${item.id}">
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="remove__btn" data-id="${item.id}"><i class="ri-delete-bin-line"></i></button>
            </td>
        `;
        cartItemsContainer.appendChild(row);

        // ============ Quantity input handler =============
        const quantityInput = row.querySelector('.cart-quantity');
        quantityInput.addEventListener('input', async () => {
            let newQuantity = quantityInput.value.replace(/\D/g, "");  
            newQuantity = parseInt(newQuantity);

            if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
            if (newQuantity > 1000) newQuantity = 1000;

            quantityInput.value = newQuantity;
            await updateQuantity(item.id, newQuantity);
        })

        // ======== Remove button handler ========
        const removeBtn = row.querySelector('.remove__btn');
        removeBtn.addEventListener('click', async () => {
            await removeItem(item.id);
        });
    });

    updateCartTotals(subtotal);
}

// ============ Update Quantity and Remove Item Functions ============
async function updateQuantity(productId, quantity) {
    try {
        await fetch('/update_cart_quantity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity: quantity })
        });
        await fetchCartItems();
    } catch (error) {
        alert('Failed to update quantity.');
    }
}

// ============ Remove Item Function ============
async function removeItem(productId) {
    try {
        await fetch('/remove_from_cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        });
        await fetchCartItems();
    } catch (error) {
        alert('Failed to remove item.');
    }
}

// ============ Update Cart Totals Function ============
function updateCartTotals(subtotal) {
    const shipping = 20.00;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function enableCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('disabled');
        checkoutButton.style.opacity = '1';
        checkoutButton.style.cursor = 'pointer';
    }
}

function disableCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.disabled = true;
        checkoutButton.classList.add('disabled');
        checkoutButton.style.opacity = '0.5';
        checkoutButton.style.cursor = 'not-allowed';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function () {
            if (!checkoutButton.disabled) {
                window.location.href = '/checkout';
            }
        });
    }
});
