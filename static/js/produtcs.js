document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.querySelector('.product__grid');
    
    async function loadProducts(type = null) {
        try {
            const url = type 
                ? `/api/products/type/${type}`
                : '/api/products';
                
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                renderProducts(data.products);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }
    
    function renderProducts(products) {
        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product__card';
            productCard.innerHTML = `
                <h4>${product.name}</h4>
                <p>${product.price}</p>
                <img src="${product.image_url || 'https://via.placeholder.com/300'}" alt="${product.name}">
                <button class="shop__btn">Add To Cart <i class="ri-shopping-cart-2-line"></i></button>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    loadProducts();
    
    document.querySelectorAll('.filter .shop__btn').forEach(button => {
        button.addEventListener('click', function() {
            const productType = this.textContent.trim();
            loadProducts(productType === 'All' ? null : productType);
        });
    });
});