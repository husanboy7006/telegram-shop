const tg = window.Telegram.WebApp;

// Initialize app securely
tg.expand();
tg.ready();

// Mock Data - O'zbek tilida, faqat elektronika
const products = [
    {
        id: 1,
        name: "Simsiz Quloqchinlar Premium",
        price: 99.99,
        image: "./assets/headphones.jpg",
        category: "electronics",
        badge: "yangi"
    },
    {
        id: 2,
        name: "Aqlli Soat (Smart Watch)",
        price: 149.50,
        image: "./assets/watch.jpg",
        category: "electronics",
        badge: "chegirma"
    },
    {
        id: 4,
        name: "Mexanik Klaviatura Pro",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&auto=format&fit=crop&q=60",
        category: "electronics",
        badge: "yangi"
    },
    {
        id: 7,
        name: "O'yin Sichqonchasi (Gaming Mouse)",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60",
        category: "electronics",
        badge: null
    },
    {
        id: 8,
        name: "PowerBank 20000mAh",
        price: 35.00,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60",
        category: "electronics",
        badge: "ommabop"
    },
    {
        id: 9,
        name: "Simsiz Kolonka",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
        category: "electronics",
        badge: null
    }
];

// State
let cart = {};

// DOM Elements
const container = document.getElementById('products-container');
const app = document.getElementById('app');
const loader = document.getElementById('loader');

// Initialize
function init() {
    renderProducts();

    // Simulate loading
    setTimeout(() => {
        loader.classList.add('hidden');
        app.classList.add('loaded');
    }, 500);

    // Setup MainButton
    tg.MainButton.setText(`Buyurtma berish`);
    tg.MainButton.onClick(handleMainButtonClick);
}

// Render Products
function renderProducts() {
    // Filtrlash yo'q, hamma mahsulot chiqadi
    container.innerHTML = products.map(product => {
        const count = cart[product.id] || 0;
        return `
        <div class="product-card" onclick="triggerHaptic()">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-badges">
                    ${product.badge ? `<span class="badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : ''}
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn ${count > 0 ? 'has-items' : ''}" onclick="addToCart(${product.id}, this)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="count-badge">${count}</span>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Add to Cart
window.addToCart = (id, btnElement) => {
    // Add animation class
    btnElement.classList.add('clicked');
    setTimeout(() => btnElement.classList.remove('clicked'), 200);

    if (!cart[id]) cart[id] = 0;
    cart[id]++;

    // Update UI immediately (optimistic update)
    const countBadge = btnElement.querySelector('.count-badge');
    countBadge.textContent = cart[id];
    btnElement.classList.add('has-items');

    // Haptic feedback
    tg.HapticFeedback.impactOccurred('medium');

    updateMainButton();
};

// Haptic helper
window.triggerHaptic = () => {
    // Optional: lighter feedback on card click if needed
};

// Update Main Button
function updateMainButton() {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
        const product = products.find(p => p.id == id);
        return sum + (product.price * count);
    }, 0);

    if (totalItems > 0) {
        tg.MainButton.setText(`Buyurtma berish ($${totalPrice.toFixed(2)})`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Handle Checkout
function handleMainButtonClick() {
    const data = JSON.stringify(cart);
    tg.sendData(data);
}

// Start
init();
