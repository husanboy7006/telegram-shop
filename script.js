const tg = window.Telegram.WebApp;

// Initialize
tg.expand();
tg.ready();

// Data
const products = [
    { id: 1, name: "Simsiz Quloqchin (Oddiy)", price: 95000, image: "./assets/headphones.jpg", badge: "arzon" },
    { id: 2, name: "Fitnes Braslet M6", price: 120000, image: "./assets/watch.jpg", badge: "xit" },
    { id: 3, name: "Telefon G'ilofi (Chexol)", price: 35000, image: "./assets/wallet.jpg", badge: null },
    { id: 4, name: "USB Kabel (Type-C)", price: 25000, image: "./assets/backpack.jpg", badge: null },
    { id: 5, name: "Quyosh Ko'zoynagi", price: 60000, image: "./assets/sunglasses.jpg", badge: "yozgi" },
    { id: 6, name: "Ryukzak (Maktab uchun)", price: 185000, image: "./assets/backpack.jpg", badge: "chegirma" }
];

let cart = {};
let currentView = 'home';

// DOM
const app = document.getElementById('app');
const loader = document.getElementById('loader');
const views = {
    home: document.getElementById('home-view'),
    cart: document.getElementById('cart-view'),
    checkout: document.getElementById('checkout-view')
};
const cartIconCount = document.getElementById('header-cart-count');

// Init
function init() {
    renderProducts();
    updateCartCount();

    // Simulate loading
    setTimeout(() => {
        loader.classList.add('hidden');
        app.classList.add('loaded');
    }, 500);

    // Back button handler
    tg.BackButton.onClick(() => {
        if (currentView === 'checkout') navigate('cart');
        else if (currentView === 'cart') navigate('home');
    });
}

// Navigation
window.navigate = (viewId) => {
    // Hide all
    Object.values(views).forEach(el => el.classList.remove('active'));
    // Show target
    views[viewId].classList.add('active');
    currentView = viewId;

    // Handle BackButton and MainButton
    if (viewId === 'home') {
        tg.BackButton.hide();
        tg.MainButton.hide();
    } else {
        tg.BackButton.show();
    }

    if (viewId === 'cart') {
        renderCartItems();
        updateMainButton();
    }

    if (viewId === 'checkout') {
        tg.MainButton.setText('BUYURTMANI TASDIQLASH');
        tg.MainButton.show();
    }

    window.scrollTo(0, 0);
};

window.goToCart = () => navigate('cart');

// Render Home
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(p => {
        const count = cart[p.id] || 0;
        return `
        <div class="product-card" onclick="triggerHaptic()">
            <div class="product-image-container">
                <img src="${p.image}" class="product-image" loading="lazy">
                <div class="product-badges">
                    ${p.badge ? `<span class="badge badge-${p.badge}">${p.badge.toUpperCase()}</span>` : ''}
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(p.price)}</span>
                    <button class="add-btn ${count > 0 ? 'has-items' : ''}" onclick="addToCart(${p.id}, this)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5V19M5 12H19"/>
                        </svg>
                        <span class="count-badge">${count}</span>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// Cart Logic
window.addToCart = (id, btn) => {
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);

    if (!cart[id]) cart[id] = 0;
    cart[id]++;

    // Update badge on button
    const badge = btn.querySelector('.count-badge');
    badge.textContent = cart[id];
    btn.classList.add('has-items');

    updateCartCount();
    tg.HapticFeedback.impactOccurred('medium');
};

function updateCartCount() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    cartIconCount.textContent = total;
    if (total > 0) cartIconCount.classList.remove('hidden');
    else cartIconCount.classList.add('hidden');
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const items = Object.entries(cart).map(([id, count]) => {
        const p = products.find(x => x.id == id);
        return { ...p, count };
    }).filter(x => x.count > 0);

    if (items.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">Savatingiz bo\'sh</div>';
        document.getElementById('cart-total-price').textContent = "0 so'm";
        tg.MainButton.hide();
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="cart-item">
            <img src="${item.image}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.count}</div>
            </div>
            <div class="cart-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.count}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const total = items.reduce((sum, item) => sum + (item.price * item.count), 0);
    document.getElementById('cart-total-price').textContent = formatPrice(total);
}

window.changeQty = (id, delta) => {
    if (!cart[id]) return;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];

    updateCartCount();
    renderCartItems();
    renderProducts(); // Update home view badges too
    updateMainButton();
    tg.HapticFeedback.selectionChanged();
};

function updateMainButton() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    if (currentView === 'cart' && total > 0) {
        tg.MainButton.setText('RASMIYLASHTIRISH');
        tg.MainButton.show();
    } else if (currentView === 'cart') {
        tg.MainButton.hide();
    }
}

// Helpers
function formatPrice(p) {
    return p.toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm";
}

window.triggerHaptic = () => tg.HapticFeedback.selectionChanged();

// Main Button Handler
tg.MainButton.onClick(() => {
    if (currentView === 'cart') {
        navigate('checkout');
    } else if (currentView === 'checkout') {
        submitOrder();
    }
});

function submitOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (!name || !phone || !address) {
        tg.showAlert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    const payload = {
        cart: cart,
        user_info: { name, phone, address }
    };

    tg.sendData(JSON.stringify(payload));
}

init();
