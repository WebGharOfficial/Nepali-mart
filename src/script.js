// Modern E-commerce JavaScript for Nepali Mart

document.addEventListener('DOMContentLoaded', () => {
    // --- Function Declarations (hoisted) ---
    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            if (totalItems > 0) {
                cartCountElement.classList.add('cart-badge');
                setTimeout(() => {
                    cartCountElement.classList.remove('cart-badge');
                }, 300);
            }
        }
    }
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        saveCart();
        showToast(`${product.quantity} x ${product.name} added to cart!`);
    }
    function loadCart() {
        try {
            const cartFromStorage = localStorage.getItem('cart');
            cart = cartFromStorage ? JSON.parse(cartFromStorage) : [];
        } catch (e) {
            cart = [];
            if (typeof showToast === 'function') showToast('Cart data corrupted. Cart reset.', 'error');
        }
        updateCartCount();
        if (window.location.pathname.endsWith('cart.html') || window.location.pathname.endsWith('/cart.html')) {
            renderCartPage();
        }
    }
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    function renderCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSummary = {
            subtotal: document.getElementById('cart-subtotal'),
            shipping: document.getElementById('shipping-cost'),
            tax: document.getElementById('tax-amount'),
            total: document.getElementById('cart-total'),
        };
        const cartEmptyMessage = document.getElementById('cart-empty');
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            if (cartEmptyMessage) {
                cartEmptyMessage.style.display = 'block';
            }
            if (cartSummary.total) {
                cartSummary.total.textContent = 'Rs. 0';
            }
            if (cartSummary.subtotal) {
                cartSummary.subtotal.textContent = 'Rs. 0';
            }
            if (cartSummary.shipping) {
                cartSummary.shipping.textContent = 'Rs. 0';
            }
            if (cartSummary.tax) {
                cartSummary.tax.textContent = 'Rs. 0';
            }
            return;
        }
        if (cartEmptyMessage) {
            cartEmptyMessage.style.display = 'none';
        }
        let subtotal = 0;
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            const cartItemHTML = `
                <div class="flex items-center space-x-4 p-4 bg-white rounded-lg mb-4 shadow-md">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <p class="text-green-600 font-bold">Rs. ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                    </div>
                    <p class="font-bold text-gray-800">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-from-cart text-red-500 hover:text-red-700" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
        let discount = 0;
        if (appliedPromo === 'DISCOUNT10') {
            discount = subtotal * 0.10;
        }
        const shipping = subtotal > 6650 ? 0 : 200;
        const tax = (subtotal - discount) * 0.13;
        const total = subtotal - discount + shipping + tax;
        if (cartSummary.subtotal) {
            cartSummary.subtotal.textContent = `Rs. ${subtotal.toFixed(0)}`;
        }
        if (cartSummary.shipping) {
            cartSummary.shipping.textContent = shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(0)}`;
        }
        if (cartSummary.tax) {
            cartSummary.tax.textContent = `Rs. ${tax.toFixed(0)}`;
        }
        if (cartSummary.total) {
            cartSummary.total.textContent = `Rs. ${total.toFixed(0)}`;
        }
        let discountRow = document.getElementById('discount-amount');
        if (discount > 0) {
            if (!discountRow) {
                discountRow = document.createElement('div');
                discountRow.className = 'flex justify-between text-green-600';
                discountRow.id = 'discount-amount';
                cartSummary.tax.parentElement.insertBefore(discountRow, cartSummary.tax);
            }
            discountRow.innerHTML = `<span>Discount</span><span>-Rs. ${discount.toFixed(0)}</span>`;
        } else if (discountRow) {
            discountRow.remove();
        }
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const { index, action } = btn.dataset;
                const item = cart[index];
                if (action === 'increase') {
                    item.quantity++;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity--;
                } else if (action === 'decrease' && item.quantity <= 1) {
                    cart.splice(index, 1);
                }
                saveCart();
                renderCartPage();
            });
        });
        cartItemsContainer.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.splice(btn.dataset.index, 1);
                saveCart();
                renderCartPage();
            });
        });
    }

    // --- End Function Declarations ---

    // Initialize cart from localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
        if (typeof showToast === 'function') showToast('Cart data corrupted. Cart reset.', 'error');
    }
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartCountElement = document.getElementById('cart-count');
    const searchInput = document.querySelector('input[placeholder="Search products..."]');
    // Initialize cart count
    updateCartCount();
    
    // Enhanced Category Dropdown Functionality
    const categoryDropdowns = document.querySelectorAll('.relative.group');
    categoryDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const menu = dropdown.querySelector('.absolute');
        
        if (button && menu) {
            // Show on hover
            dropdown.addEventListener('mouseenter', () => {
                menu.classList.remove('opacity-0', 'invisible');
                menu.classList.add('opacity-100', 'visible');
            });
            
            // Hide on mouse leave
            dropdown.addEventListener('mouseleave', () => {
                menu.classList.add('opacity-0', 'invisible');
                menu.classList.remove('opacity-100', 'visible');
            });
            
            // Also work with click for mobile
            button.addEventListener('click', (e) => {
                e.preventDefault();
                menu.classList.toggle('opacity-0', 'invisible');
                menu.classList.toggle('opacity-100', 'visible');
            });
        }
    });
    
    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = mobileMenu.classList.contains('hidden') ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
        });
    }
    
    // Sticky Navigation
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.classList.add('sticky-nav');
        } else {
            nav.classList.remove('sticky-nav');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Enhanced Search Functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            // Remove existing search popup
            const existingPopup = document.getElementById('search-popup');
            if (existingPopup) {
                existingPopup.remove();
            }
            
            if (searchTerm.length < 2) return;
            
            // Get all product cards on the current page
            const productCards = document.querySelectorAll('.bg-white.rounded-xl');
            const matchingProducts = [];
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const productDesc = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                    const productData = {
                        name: card.querySelector('h3')?.textContent || '',
                        price: card.querySelector('.text-2xl')?.textContent || '',
                        image: card.querySelector('img')?.src || '',
                        element: card
                    };
                    matchingProducts.push(productData);
                }
            });
            
            // Create search popup
            if (matchingProducts.length > 0) {
                const popup = document.createElement('div');
                popup.id = 'search-popup';
                popup.className = 'absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto';
                
                let popupHTML = '<div class="p-4">';
                popupHTML += `<h3 class="font-semibold text-gray-800 mb-3">Found ${matchingProducts.length} product(s):</h3>`;
                
                matchingProducts.forEach(product => {
                    popupHTML += `
                        <div class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer" onclick="scrollToProduct(this)">
                            <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded">
                            <div class="flex-1">
                                <h4 class="font-medium text-gray-800">${product.name}</h4>
                                <p class="text-green-600 font-bold">${product.price}</p>
                            </div>
                        </div>
                    `;
                });
                
                popupHTML += '</div>';
                popup.innerHTML = popupHTML;
                
                // Insert popup after search input
                const searchContainer = searchInput.closest('.relative');
                searchContainer.appendChild(popup);
                
                // Close popup when clicking outside
                document.addEventListener('click', function closePopup(e) {
                    if (!searchContainer.contains(e.target)) {
                        popup.remove();
                        document.removeEventListener('click', closePopup);
                    }
                });
            }
        });
    }
    
    // Function to scroll to product
    window.scrollToProduct = (element) => {
        const productCard = element.closest('.bg-white.rounded-xl');
        if (productCard) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            productCard.style.transition = 'all 0.3s ease';
            productCard.style.transform = 'scale(1.02)';
            productCard.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            
            setTimeout(() => {
                productCard.style.transform = 'scale(1)';
                productCard.style.boxShadow = '';
            }, 1000);
        }
        
        // Remove search popup
        const popup = document.getElementById('search-popup');
        if (popup) popup.remove();
    };
    
    // Clear Cart Button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                renderCartPage();
                showToast('Cart cleared!', 'success');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[src*="placeholder"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loading');
                // Simulate loading delay
                setTimeout(() => {
                    img.classList.remove('loading');
                }, 500);
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Enhanced Category filter functionality
    document.querySelectorAll('.category-icon').forEach(category => {
        category.addEventListener('click', () => {
            const categoryName = category.querySelector('h3').textContent;
            // Filter products by category (implement as needed)
            console.log(`Filtering by category: ${categoryName}`);
        });
    });
    
    // Enhanced Checkout functionality
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        let checkoutModal = null;
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!', 'error');
                return;
            }
            if (checkoutModal) return; // Prevent multiple modals
            // Create modal
            checkoutModal = document.createElement('div');
            checkoutModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
            checkoutModal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
                    <h2 class="text-2xl font-bold text-green-700 mb-4">Thank you for your purchase!</h2>
                    <p class="mb-6">Your order has been placed successfully. We appreciate your business.</p>
                    <button id="close-checkout-modal" class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">Close</button>
                </div>
            `;
            document.body.appendChild(checkoutModal);
            document.getElementById('close-checkout-modal').addEventListener('click', () => {
                document.body.removeChild(checkoutModal);
                checkoutModal = null;
            });
            cart = [];
            saveCart();
            renderCartPage();
        });
    }
    
    // Enhanced Awards Slideshow Functionality
    const awardsContainer = document.getElementById('awards-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.award-dot');

    if (!awardsContainer) {
        console.error('Slideshow: #awards-container not found');
    }
    if (!prevBtn) {
        console.error('Slideshow: #prev-btn not found');
    }
    if (!nextBtn) {
        console.error('Slideshow: #next-btn not found');
    }
    if (dots.length === 0) {
        console.error('Slideshow: .award-dot not found');
    }

    if (awardsContainer && prevBtn && nextBtn && dots.length > 0) {
        console.log('Slideshow initialized');
        let currentSlide = 0;
        const totalSlides = 3;
        let autoPlayInterval;
        
        const updateSlideshow = () => {
            const translateX = -currentSlide * 100;
            awardsContainer.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                    dot.classList.add('bg-white');
                    dot.classList.remove('bg-opacity-60');
                } else {
                    dot.classList.remove('active');
                    dot.classList.remove('bg-white');
                    dot.classList.add('bg-opacity-60');
                }
            });
        };
        
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlideshow();
            }, 5000);
        };
        
        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        };
        
        // Next button
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlideshow();
            startAutoPlay();
        });
        
        // Previous button
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlideshow();
            startAutoPlay();
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                currentSlide = index;
                updateSlideshow();
                startAutoPlay();
            });
        });
        
        // Pause auto-play on hover
        awardsContainer.addEventListener('mouseenter', stopAutoPlay);
        awardsContainer.addEventListener('mouseleave', startAutoPlay);
        
        // Start auto-play
        startAutoPlay();
        
        // Initialize slideshow
        updateSlideshow();
    }
    
    // Scroll to Award Function
    window.scrollToAward = (awardId) => {
        const awardElement = document.getElementById(awardId);
        if (awardElement) {
            awardElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Add highlight effect
            awardElement.style.transition = 'all 0.3s ease';
            awardElement.style.transform = 'scale(1.02)';
            awardElement.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            
            setTimeout(() => {
                awardElement.style.transform = 'scale(1)';
                awardElement.style.boxShadow = '';
            }, 1000);
        }
    };

    // Enhanced Product Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const categorySelect = document.querySelector('select');
    const sortSelect = document.querySelectorAll('select')[1];
    const productCountElement = document.getElementById('product-count');
    
    // Filter by category
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            const selectedCategory = categorySelect.value.toLowerCase();
            filterProducts();
        });
    }
    
    // Sort products
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            filterProducts();
        });
    }
    
    // Filter buttons (if they exist)
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('bg-green-600', 'text-white'));
                filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
                button.classList.remove('bg-gray-200', 'text-gray-700');
                button.classList.add('bg-green-600', 'text-white');
                
                // Filter products
                filterProducts(category);
            });
        });
    }
    
    // Main filter function
    function filterProducts(selectedCategory = null) {
        const categoryFilter = selectedCategory || (categorySelect ? categorySelect.value.toLowerCase() : 'all');
        const sortOrder = sortSelect ? sortSelect.value : 'Price: Low to High';
        
        let visibleProducts = [];
        
        // Get all product cards
        const allProductCards = document.querySelectorAll('.bg-white.rounded-xl[data-category]');
        
        allProductCards.forEach(card => {
            const productName = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const productDesc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const productPrice = parseFloat(card.querySelector('.text-2xl')?.textContent.replace(/[^\d.]/g, '') || '0');
            const productCategory = card.getAttribute('data-category').toLowerCase();
            
            // Apply category filter
            if (categoryFilter === 'all categories' || categoryFilter === 'all' || productCategory === categoryFilter) {
                card.style.display = 'block';
                visibleProducts.push({
                    element: card,
                    name: productName,
                    price: productPrice
                });
            } else {
                card.style.display = 'none';
            }
        });
        
        // Sort products
        visibleProducts.sort((a, b) => {
            switch (sortOrder) {
                case 'Price: Low to High':
                    return a.price - b.price;
                case 'Price: High to Low':
                    return b.price - a.price;
                case 'Name: A to Z':
                    return a.name.localeCompare(b.name);
                case 'Name: Z to A':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
        
        // Reorder products in DOM
        const container = visibleProducts[0]?.element?.parentElement;
        if (container) {
            visibleProducts.forEach(product => {
                container.appendChild(product.element);
            });
        }
        
        // Update product count
        if (productCountElement) {
            productCountElement.textContent = visibleProducts.length;
        }
        // Show/hide 'No products found' message
        let noProductsMsg = document.getElementById('no-products-msg');
        if (!noProductsMsg) {
            noProductsMsg = document.createElement('div');
            noProductsMsg.id = 'no-products-msg';
            noProductsMsg.className = 'text-center text-gray-500 py-8';
            noProductsMsg.textContent = 'No products found.';
            const grid = document.querySelector('.products-grid');
            grid?.parentElement?.appendChild(noProductsMsg);
        }
        if (visibleProducts.length === 0) {
            noProductsMsg.style.display = 'block';
        } else {
            noProductsMsg.style.display = 'none';
        }
        
        // Add animation
        visibleProducts.forEach(product => {
            product.element.style.animation = 'fadeIn 0.5s ease-in';
        });
    }
    
    // Add CSS animation for fade in effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 0.5rem;
            color: white;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .cart-badge {
            animation: pulse 0.3s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize filters if on products page
    if (window.location.pathname.endsWith('products.html') || window.location.pathname.endsWith('/products.html')) {
        filterProducts();
    }
    
    // Promo Code Logic
    let appliedPromo = null;
    const promoInput = document.querySelector('input[placeholder="Enter code"]');
    const promoBtn = promoInput?.nextElementSibling;

    if (promoInput && promoBtn) {
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            if (appliedPromo) {
                showToast('Promo code already applied!', 'error');
                return;
            }
            if (code === 'DISCOUNT10') {
                appliedPromo = 'DISCOUNT10';
                showToast('Promo code applied! 10% off.', 'success');
                renderCartPage();
            } else {
                showToast('Invalid promo code.', 'error');
            }
        });
    }
    
    // Add to Cart Button Functionality and Animation
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Button animation: change text and color
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.classList.add('bg-green-800');
            btn.classList.remove('bg-green-600');
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Added!';

            // Extract product info
            const name = btn.getAttribute('data-name') || btn.closest('.p-6')?.querySelector('h3')?.textContent || '';
            const price = parseFloat(btn.getAttribute('data-price')) || 0;
            // Try to get image from card
            let image = '';
            const card = btn.closest('.bg-white.rounded-xl');
            if (card) {
                const img = card.querySelector('img');
                if (img) image = img.src;
            }
            // Add to cart
            addToCart({ name, price, image, quantity: 1 });

            // Animate cart badge
            if (cartCountElement) {
                cartCountElement.classList.add('cart-badge');
                setTimeout(() => {
                    cartCountElement.classList.remove('cart-badge');
                }, 400);
            }

            // Revert button after 1s
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('bg-green-800');
                btn.classList.add('bg-green-600');
            }, 1000);
        });
    });
    
    // Initial Load
    loadCart();
}); 