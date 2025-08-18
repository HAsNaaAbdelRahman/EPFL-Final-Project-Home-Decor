// ====================== Navbar Script ======================
document.addEventListener("DOMContentLoaded", function() {
    async function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (!cartCountElement) return;
        
        try {
            const response = await fetch('/get_cart_items');
            if (response.ok) {
                const data = await response.json();
                const count = data.cart ? data.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
                cartCountElement.textContent = count;
                
                if (count > 0) {
                    cartCountElement.style.display = 'flex';
                    cartCountElement.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        cartCountElement.style.transform = 'scale(1)';
                    }, 300);
                } else {
                    cartCountElement.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Failed to update cart count:', error);
        }
    }

    function initNavbar() {
        updateCartCount();
        
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('mouseenter', () => {
                cartIcon.style.transform = 'translateY(-2px)';
            });
            cartIcon.addEventListener('mouseleave', () => {
                cartIcon.style.transform = 'translateY(0)';
            });
        }
    }

    initNavbar();
});