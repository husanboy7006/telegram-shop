const tg = window.Telegram.WebApp;

// Initialize app securely
tg.expand();
tg.ready();

// Mock Data - Hamyonbop mahsulotlar (UZS)
const products = [
    {
        id: 1,
        name: "Simsiz Quloqchin (Oddiy)",
        price: 95000,
        image: "./assets/headphones.jpg", // TWS i12 kabi
        category: "electronics",
        badge: "arzon"
    },
    {
        id: 2,
        name: "Fitnes Braslet M6",
        price: 120000,
        image: "./assets/watch.jpg",
        category: "electronics",
        badge: "xit"
    },
    {
        id: 3,
        name: "Telefon G'ilofi (Chexol)",
        price: 35000,
        image: "./assets/wallet.jpg", // Hozircha wallet rasmi turibdi
        category: "accessories",
        badge: null
    },
    {
        id: 4,
        name: "USB Kabel (Type-C)",
        price: 25000,
        image: "./assets/backpack.jpg", // Placeholder
        category: "electronics",
        badge: null
    },
    {
        id: 5,
        name: "Quyosh Ko'zoynagi",
        price: 60000,
        image: "./assets/sunglasses.jpg",
        category: "accessories",
        badge: "yozgi"
    },
    {
        id: 6,
        name: "Ryukzak (Maktab uchun)",
        price: 185000,
        image: "./assets/backpack.jpg",
        category: "accessories",
        badge: "chegirma"
    }
];

// State
let cart = {};

// DOM Elements
const container = document.getElementById('products-container');
const app = document.getElementById('app');
const loader = document.getElementById('loader');

// Helper to format currency
function formatPrice(price) {
    return price.toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm";
}

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
                    <span class="product-price">${formatPrice(product.price)}</span>
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
        tg.MainButton.setText(`Buyurtma berish (${formatPrice(totalPrice)})`);
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
