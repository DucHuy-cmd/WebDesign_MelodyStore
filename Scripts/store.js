/**
 * Melody Store - Client-Side Interactive Store Engine
 * Provides dynamic Cart, Wishlist, Coupon, Checkout, and Notification support
 * Powered by LocalStorage (100% compatible with GitHub Pages static hosting)
 */

(function () {
    'use strict';

    const STORAGE_KEY_CART = 'melody_store_cart_v1';
    const STORAGE_KEY_WISHLIST = 'melody_store_wishlist_v1';
    const STORAGE_KEY_COUPON = 'melody_store_coupon_v1';
    const STORAGE_KEY_ORDERS = 'melody_store_orders_v1';

    const DEFAULT_CART = [
        {
            id: 'taylor-214ce',
            name: 'Taylor 214ce Deluxe Acoustic Guitar',
            price: 1199.00,
            image: 'Images/cart/cart-1.jpg',
            quantity: 1
        },
        {
            id: 'fender-stratocaster',
            name: 'Fender Player Stratocaster Electric Guitar',
            price: 849.00,
            image: 'Images/cart/cart-2.jpg',
            quantity: 1
        },
        {
            id: 'ath-m50x',
            name: 'Audio-Technica ATH-M50x Headphones',
            price: 169.00,
            image: 'Images/cart/cart-3.jpg',
            quantity: 1
        }
    ];

    const MelodyStore = {
        // Retrieve cart from localStorage
        getCart: function () {
            try {
                const stored = localStorage.getItem(STORAGE_KEY_CART);
                if (!stored) {
                    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(DEFAULT_CART));
                    return [...DEFAULT_CART];
                }
                return JSON.parse(stored);
            } catch (e) {
                return [...DEFAULT_CART];
            }
        },

        // Save cart to localStorage and sync headers
        saveCart: function (cart) {
            try {
                localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
            } catch (e) {
                console.error('Error saving cart:', e);
            }
            this.syncHeader();
        },

        // Add item to cart
        addToCart: function (product, qty = 1) {
            const cart = this.getCart();
            const existingIndex = cart.findIndex(item => item.id === product.id || item.name.toLowerCase() === product.name.toLowerCase());

            if (existingIndex > -1) {
                cart[existingIndex].quantity += qty;
            } else {
                cart.push({
                    id: product.id || 'item-' + Date.now(),
                    name: product.name,
                    price: parseFloat(product.price) || 0,
                    image: product.image || 'Images/product/product-1.jpg',
                    quantity: qty
                });
            }

            this.saveCart(cart);
            this.toast('Added to Cart!', `"${product.name}" (x${qty}) is now in your shopping cart.`, 'success');
        },

        // Update item quantity
        updateQuantity: function (productId, quantity) {
            let cart = this.getCart();
            const target = cart.find(item => item.id === productId);
            if (target) {
                target.quantity = parseInt(quantity, 10);
                if (target.quantity <= 0) {
                    cart = cart.filter(item => item.id !== productId);
                }
                this.saveCart(cart);
            }
            return cart;
        },

        // Remove item from cart
        removeFromCart: function (productId) {
            let cart = this.getCart();
            const removed = cart.find(item => item.id === productId);
            cart = cart.filter(item => item.id !== productId);
            this.saveCart(cart);
            if (removed) {
                this.toast('Item Removed', `"${removed.name}" was removed from your cart.`, 'info');
            }
            return cart;
        },

        // Calculate Totals & Discounts
        getTotals: function () {
            const cart = this.getCart();
            let subtotal = 0;
            let totalItems = 0;

            cart.forEach(item => {
                subtotal += (item.price * item.quantity);
                totalItems += item.quantity;
            });

            let discountPercent = 0;
            const appliedCoupon = localStorage.getItem(STORAGE_KEY_COUPON);
            if (appliedCoupon === 'UTC2') {
                discountPercent = 20;
            } else if (appliedCoupon === 'MELODY10') {
                discountPercent = 10;
            }

            const discountAmount = subtotal * (discountPercent / 100);
            const total = Math.max(0, subtotal - discountAmount);

            return {
                subtotal: subtotal,
                discountPercent: discountPercent,
                discountAmount: discountAmount,
                total: total,
                totalItems: totalItems,
                coupon: appliedCoupon
            };
        },

        // Synchronize Header badges across all 8 pages
        syncHeader: function () {
            const totals = this.getTotals();
            const formattedTotal = '$' + totals.total.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Update cart icon counter badge
            document.querySelectorAll('.header__cart ul li:last-child span, .header__cart a[href*="shoping-cart"] span').forEach(el => {
                el.textContent = totals.totalItems;
            });

            // Update cart price text
            document.querySelectorAll('.header__cart__price span').forEach(el => {
                el.textContent = formattedTotal;
            });

            // Sync wishlist counter
            const wishlist = this.getWishlist();
            document.querySelectorAll('.header__cart ul li:first-child span, .header__cart a[href*="heart"] span').forEach(el => {
                el.textContent = wishlist.length;
            });
        },

        // Wishlist management
        getWishlist: function () {
            try {
                const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                return [];
            }
        },

        toggleWishlist: function (product) {
            let wishlist = this.getWishlist();
            const exists = wishlist.some(item => item.id === product.id || item.name === product.name);

            if (exists) {
                wishlist = wishlist.filter(item => item.name !== product.name);
                this.toast('Wishlist Updated', `Removed "${product.name}" from your wishlist.`, 'info');
            } else {
                wishlist.push({
                    id: product.id || 'wish-' + Date.now(),
                    name: product.name,
                    price: product.price
                });
                this.toast('Wishlist', `Added "${product.name}" to your favorites!`, 'success');
            }

            localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
            this.syncHeader();
            return !exists;
        },

        // Toast Notification System
        toast: function (title, message, type = 'success') {
            let container = document.getElementById('melody-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'melody-toast-container';
                document.body.appendChild(container);
            }

            const iconMap = {
                success: 'fa-check-circle',
                info: 'fa-info-circle',
                warning: 'fa-exclamation-triangle',
                danger: 'fa-times-circle'
            };

            const toast = document.createElement('div');
            toast.className = `melody-toast toast-${type}`;
            toast.innerHTML = `
                <div class="melody-toast__icon"><i class="fa ${iconMap[type] || 'fa-bell'}"></i></div>
                <div class="melody-toast__body">
                    <div class="melody-toast__title">${title}</div>
                    <div class="melody-toast__message">${message}</div>
                </div>
                <button class="melody-toast__close">&times;</button>
            `;

            container.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            const closeToast = () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 400);
            };

            toast.querySelector('.melody-toast__close').addEventListener('click', closeToast);

            // Auto dismiss after 4 seconds
            setTimeout(closeToast, 4000);
        },

        // Order Confirmation Modal
        showOrderModal: function (order) {
            let modal = document.getElementById('melody-order-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'melody-order-modal';
                document.body.appendChild(modal);
            }

            const itemsHtml = order.items.map(item => `
                <div>
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');

            modal.innerHTML = `
                <div class="melody-modal__card">
                    <div class="melody-modal__icon"><i class="fa fa-check"></i></div>
                    <div class="melody-modal__title">Order Placed Successfully!</div>
                    <div class="melody-modal__desc">Thank you for your purchase, <strong>${order.customerName}</strong>! Your musical instruments are being prepared for express delivery.</div>
                    <div class="melody-modal__details">
                        <div><span>Order Code:</span> <strong>${order.orderId}</strong></div>
                        <div><span>Recipient:</span> <span>${order.customerName} (${order.phone})</span></div>
                        <div><span>Address:</span> <span>${order.address}</span></div>
                        <div style="margin: 10px 0 6px 0; border-top: 1px dashed #ccc; padding-top: 6px;">
                            <strong>Items Ordered:</strong>
                        </div>
                        ${itemsHtml}
                        <div style="margin-top: 8px;">
                            <span>Total Paid:</span>
                            <strong style="color: #d97706; font-size: 16px;">$${order.total.toFixed(2)}</strong>
                        </div>
                    </div>
                    <a href="index.html" class="melody-modal__btn">CONTINUE SHOPPING</a>
                </div>
            `;

            modal.classList.add('active');
        }
    };

    // Global expose
    window.MelodyStore = MelodyStore;

    // Initialize on DOM Ready
    document.addEventListener('DOMContentLoaded', function () {
        MelodyStore.syncHeader();

        /* ========================================================
           1. SHOP DETAILS PAGE: Add to Cart button
           ======================================================== */
        const detailAddCartBtn = document.getElementById('detail-add-cart') || document.querySelector('.product__details__text .add-to-cart-btn');
        if (detailAddCartBtn) {
            detailAddCartBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const titleEl = document.querySelector('.product__details__text h3');
                const priceEl = document.querySelector('.product__details__price');
                const qtyInput = document.querySelector('.product__details__quantity input');
                const imgEl = document.querySelector('.product__details__pic__item--large');

                const name = titleEl ? titleEl.textContent.trim() : 'Fender Player Stratocaster Electric Guitar';
                const priceText = priceEl ? priceEl.textContent.replace('$', '').trim() : '849.99';
                const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
                const image = imgEl ? imgEl.getAttribute('src') : 'Images/product/details/product-details-1.jpg';

                MelodyStore.addToCart({
                    id: 'fender-player-strat',
                    name: name,
                    price: parseFloat(priceText),
                    image: image
                }, qty);
            });
        }

        /* ========================================================
           2. PRODUCT CARDS (Index & Shop Grid): Cart & Wishlist icons
           ======================================================== */
        document.querySelectorAll('.featured__item, .product__item, .product__discount__item').forEach(card => {
            const nameEl = card.querySelector('.featured__item__text h6 a, .product__item__text h6 a, .product__discount__item__text h5 a');
            const priceEl = card.querySelector('.featured__item__text h5, .product__item__text h5, .product__discount__item__text .product__item__price');
            const picEl = card.querySelector('.set-bg');

            const name = nameEl ? nameEl.textContent.trim() : 'Musical Instrument';
            let price = 500.00;
            if (priceEl) {
                const match = priceEl.textContent.match(/\$([0-9,.]+)/);
                if (match) price = parseFloat(match[1].replace(',', ''));
            }
            let image = 'Images/featured/feature-1.jpg';
            if (picEl && picEl.dataset.setbg) {
                image = picEl.dataset.setbg;
            }

            // Shopping Cart Icon Click
            const cartLink = card.querySelector('a:has(.fa-shopping-cart), a:has(.fa-shopping-bag)');
            if (cartLink) {
                cartLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    MelodyStore.addToCart({
                        id: 'item-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                        name: name,
                        price: price,
                        image: image
                    }, 1);
                });
            }

            // Wishlist Heart Icon Click
            const heartLink = card.querySelector('a:has(.fa-heart)');
            if (heartLink) {
                heartLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    const isAdded = MelodyStore.toggleWishlist({
                        id: 'item-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                        name: name,
                        price: price
                    });
                    if (isAdded) {
                        heartLink.classList.add('favorited');
                    } else {
                        heartLink.classList.remove('favorited');
                    }
                });
            }
        });

        /* ========================================================
           3. SHOPPING CART PAGE (shoping-cart.html)
           ======================================================== */
        const cartTableBody = document.querySelector('.shoping__cart__table tbody');
        if (cartTableBody) {
            renderCartPage();

            // Apply coupon form
            const couponForm = document.querySelector('.shoping__discount form');
            if (couponForm) {
                couponForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const input = couponForm.querySelector('input');
                    const code = input ? input.value.trim().toUpperCase() : '';

                    if (code === 'UTC2') {
                        localStorage.setItem(STORAGE_KEY_COUPON, 'UTC2');
                        MelodyStore.toast('Coupon Applied!', 'Congratulations! 20% UTC2 discount applied to your order.', 'success');
                        renderCartPage();
                    } else if (code === 'MELODY10') {
                        localStorage.setItem(STORAGE_KEY_COUPON, 'MELODY10');
                        MelodyStore.toast('Coupon Applied!', '10% Melody discount applied to your order.', 'success');
                        renderCartPage();
                    } else if (code === '') {
                        MelodyStore.toast('Empty Code', 'Please enter a coupon code (e.g. UTC2 or MELODY10).', 'warning');
                    } else {
                        MelodyStore.toast('Invalid Coupon', `Coupon code "${code}" is invalid or expired. Try "UTC2" or "MELODY10".`, 'danger');
                    }
                });
            }

            // Bind Continue Shopping & Checkout buttons
            document.querySelectorAll('.shoping__cart__btns a:first-child').forEach(btn => {
                btn.setAttribute('href', 'shop-grid.html');
            });
            document.querySelectorAll('.shoping__checkout a.primary-btn').forEach(btn => {
                btn.setAttribute('href', 'checkout.html');
            });
            document.querySelectorAll('.cart-btn-right').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    renderCartPage();
                    MelodyStore.toast('Cart Updated', 'Your shopping cart quantities are synced.', 'info');
                });
            });
        }

        function renderCartPage() {
            if (!cartTableBody) return;
            const cart = MelodyStore.getCart();
            const totals = MelodyStore.getTotals();

            if (cart.length === 0) {
                cartTableBody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="melody-empty-cart">
                                <i class="fa fa-shopping-basket"></i>
                                <h4>Your Shopping Cart is Empty</h4>
                                <p>Discover our wide selection of guitars, pianos, drums, and audio gear!</p>
                                <a href="shop-grid.html" class="primary-btn">EXPLORE STORE NOW</a>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                cartTableBody.innerHTML = cart.map(item => `
                    <tr data-id="${item.id}">
                        <td class="shoping__cart__item">
                            <img src="${item.image}" alt="${item.name}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 6px;">
                            <h5>${item.name}</h5>
                        </td>
                        <td class="shoping__cart__price">
                            $${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                        <td class="shoping__cart__quantity">
                            <div class="quantity">
                                <div class="pro-qty">
                                    <span class="dec qtybtn" data-id="${item.id}">-</span>
                                    <input type="text" value="${item.quantity}" data-id="${item.id}">
                                    <span class="inc qtybtn" data-id="${item.id}">+</span>
                                </div>
                            </div>
                        </td>
                        <td class="shoping__cart__total">
                            $${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                        <td class="shoping__cart__item__close">
                            <span class="icon_close" data-id="${item.id}" title="Remove item"></span>
                        </td>
                    </tr>
                `).join('');

                // Bind events for plus/minus buttons
                cartTableBody.querySelectorAll('.qtybtn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const id = this.dataset.id;
                        const input = cartTableBody.querySelector(`input[data-id="${id}"]`);
                        let currentVal = parseInt(input.value, 10) || 1;

                        if (this.classList.contains('inc')) {
                            currentVal += 1;
                        } else if (this.classList.contains('dec')) {
                            currentVal = Math.max(1, currentVal - 1);
                        }

                        input.value = currentVal;
                        MelodyStore.updateQuantity(id, currentVal);
                        renderCartPage();
                    });
                });

                // Bind input change directly
                cartTableBody.querySelectorAll('input').forEach(input => {
                    input.addEventListener('change', function () {
                        const id = this.dataset.id;
                        let val = parseInt(this.value, 10);
                        if (isNaN(val) || val < 1) val = 1;
                        this.value = val;
                        MelodyStore.updateQuantity(id, val);
                        renderCartPage();
                    });
                });

                // Bind delete item close icon
                cartTableBody.querySelectorAll('.icon_close').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const id = this.dataset.id;
                        MelodyStore.removeFromCart(id);
                        renderCartPage();
                    });
                });
            }

            // Update Cart Total card
            const checkoutUl = document.querySelector('.shoping__checkout ul');
            if (checkoutUl) {
                let discountHtml = '';
                if (totals.discountPercent > 0) {
                    discountHtml = `<li style="color: #d97706;">Coupon Discount (${totals.discountPercent}%) <span>-$${totals.discountAmount.toFixed(2)}</span></li>`;
                }
                checkoutUl.innerHTML = `
                    <li>Subtotal <span>$${totals.subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></li>
                    ${discountHtml}
                    <li>Total <span>$${totals.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></li>
                `;
            }

            MelodyStore.syncHeader();
        }

        /* ========================================================
           4. CHECKOUT PAGE (checkout.html)
           ======================================================== */
        const checkoutForm = document.querySelector('.checkout__form form');
        const checkoutOrderBox = document.querySelector('.checkout__order');
        if (checkoutOrderBox) {
            const cart = MelodyStore.getCart();
            const totals = MelodyStore.getTotals();

            // Populate items list
            const orderUl = checkoutOrderBox.querySelector('ul');
            if (orderUl) {
                if (cart.length === 0) {
                    orderUl.innerHTML = `<li>No items in cart <span>$0.00</span></li>`;
                } else {
                    orderUl.innerHTML = cart.map(item => `
                        <li>${item.name} <strong>x${item.quantity}</strong> <span>$${(item.price * item.quantity).toFixed(2)}</span></li>
                    `).join('');
                }
            }

            // Populate totals
            const subtotalEl = checkoutOrderBox.querySelector('.checkout__order__subtotal span');
            const totalEl = checkoutOrderBox.querySelector('.checkout__order__total span');
            if (subtotalEl) subtotalEl.textContent = '$' + totals.subtotal.toFixed(2);
            if (totalEl) totalEl.textContent = '$' + totals.total.toFixed(2);

            // Handle Order Submission
            if (checkoutForm) {
                checkoutForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const currentCart = MelodyStore.getCart();
                    if (currentCart.length === 0) {
                        MelodyStore.toast('Cart is Empty', 'Please add instruments to your cart before checking out.', 'warning');
                        return;
                    }

                    // Collect inputs
                    const inputs = checkoutForm.querySelectorAll('input[type="text"]');
                    const firstName = inputs[0] ? inputs[0].value.trim() : '';
                    const lastName = inputs[1] ? inputs[1].value.trim() : '';
                    const country = inputs[2] ? inputs[2].value.trim() : '';
                    const address = inputs[3] ? inputs[3].value.trim() : '';
                    const city = inputs[4] ? inputs[4].value.trim() : '';
                    const phone = inputs[6] ? inputs[6].value.trim() : '';
                    const email = inputs[7] ? inputs[7].value.trim() : '';

                    if (!firstName || !lastName || !address || !phone) {
                        MelodyStore.toast('Missing Information', 'Please fill in required fields (Name, Address, Phone).', 'danger');
                        return;
                    }

                    const orderId = '#MS-2026-' + Math.floor(1000 + Math.random() * 9000);
                    const orderData = {
                        orderId: orderId,
                        customerName: `${firstName} ${lastName}`,
                        phone: phone,
                        email: email,
                        address: `${address}, ${city || country}`,
                        items: currentCart,
                        total: totals.total,
                        createdAt: new Date().toISOString()
                    };

                    // Save order to history
                    try {
                        const orders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
                        orders.push(orderData);
                        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
                    } catch (err) {}

                    // Clear cart
                    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify([]));
                    localStorage.removeItem(STORAGE_KEY_COUPON);
                    MelodyStore.syncHeader();

                    // Show success modal
                    MelodyStore.showOrderModal(orderData);
                });
            }
        }

        /* ========================================================
           5. CONTACT FORM (contact.html)
           ======================================================== */
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const nameInput = contactForm.querySelector('input[placeholder*="name"]');
                const emailInput = contactForm.querySelector('input[placeholder*="Email"]');
                const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Valued Musician';

                MelodyStore.toast(
                    'Message Received!',
                    `Thank you, ${name}! Your inquiry has been sent to our UTC2 support team. We will reply within 24 hours.`,
                    'success'
                );
                contactForm.reset();
            });
        }

        /* ========================================================
           6. NEWSLETTER SUBSCRIPTION FORMS (Footer & Hero)
           ======================================================== */
        document.querySelectorAll('.footer__widget form').forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const emailInput = form.querySelector('input');
                const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : '';

                if (email && email.includes('@')) {
                    MelodyStore.toast('Subscribed!', 'Welcome to Melody Store Club! Check your inbox for your 10% welcome coupon.', 'success');
                    form.reset();
                } else {
                    MelodyStore.toast('Invalid Email', 'Please enter a valid email address.', 'warning');
                }
            });
        });

        /* ========================================================
           7. INTERACTIVE SEARCH BAR
           ======================================================== */
        const searchForms = document.querySelectorAll('.hero__search__form form');
        searchForms.forEach(form => {
            form.addEventListener('submit', function (e) {
                const input = form.querySelector('input');
                const query = input ? input.value.trim().toLowerCase() : '';
                if (!query) return;

                // If on shop-grid.html, filter visible products live
                const productCards = document.querySelectorAll('.product__item, .featured__item');
                if (productCards.length > 0) {
                    e.preventDefault();
                    let matchCount = 0;
                    productCards.forEach(card => {
                        const titleEl = card.querySelector('h6, h5');
                        const text = titleEl ? titleEl.textContent.toLowerCase() : '';
                        if (text.includes(query)) {
                            card.style.display = '';
                            matchCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    MelodyStore.toast('Search Results', `Found ${matchCount} musical instruments matching "${query}".`, 'info');
                }
            });
        });
    });
})();
