document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product___grid');
    const filterButtons = document.querySelectorAll('.filter__btn');

    function sanitizeQuantity(inputElement) {
        let val = inputElement.value.replace(/\D/g, ""); 
        val = parseInt(val);

        if (isNaN(val) || val < 1) val = 1;
        if (val > 1000) val = 1000;

        inputElement.value = val;
        return val;
    }

    function renderProducts(products) {
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product___card';
            productCard.innerHTML = `
                <div class="product___image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product___info">
                    <h3 class="product___name">${product.name}</h3>
                    <p class="product___type">${product.type}</p>
                    <p class="product___price">$${product.price.toFixed(2)}</p>
                    <div class="quantity-control">
                        <button class="decrease">-</button>
                        <input type="number" min="1" max="1000" value="1" class="quantity">
                        <button class="increase">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        Add to Cart <i class="ri-shopping-cart-line"></i>
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);

            const decreaseBtn = productCard.querySelector('.decrease');
            const increaseBtn = productCard.querySelector('.increase');
            const quantityInput = productCard.querySelector('.quantity');

            decreaseBtn.addEventListener('click', () => {
                quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1);
            });

            increaseBtn.addEventListener('click', () => {
                quantityInput.value = Math.min(1000, parseInt(quantityInput.value) + 1);
            });

            quantityInput.addEventListener('input', () => {
                sanitizeQuantity(quantityInput);
            });

            const addToCartBtn = productCard.querySelector('.add-to-cart');
            addToCartBtn.addEventListener('click', async () => {
                const productId = addToCartBtn.dataset.id;
                const quantity = sanitizeQuantity(quantityInput);

                try {
                    const response = await fetch('/add_to_cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ product_id: productId, quantity: quantity })
                    });

                    const result = await response.json();
                    if (result.success) {
                        showNotification(result.message || `Added ${quantity} to cart!`);
                   } else {
                        showNotification(result.error || 'Failed to add product to cart.', 'error');
                    }
                } catch (error) {
                    showNotification('Failed to add product to cart.', 'error');
                }
            });
        });
    }

    async function loadProducts(category = 'all') {
        try {
            const response = await fetch(`/get_products?type=${category}`);
            const data = await response.json();

            if (response.ok) {
                renderProducts(data);
            } else {
                throw new Error(data.error || 'Failed to load products');
            }
        } catch (error) {
            productGrid.innerHTML = `
                <div class="error-message">
                    <p>Error loading products. Please try again later.</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }


    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.type;
            loadProducts(category === 'all' ? 'all' : category);
        });
    });

    loadProducts();
});
