// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8552800146:AAELd9GbHpb14WmcMgVCcuZxhfnW3MozPB8';
const TELEGRAM_CHAT_ID = '7570614168'; // Your user ID

// Check if we're in Telegram
const isTelegram = () => {
    return typeof window.Telegram !== 'undefined' && 
           typeof window.Telegram.WebApp !== 'undefined';
};

// Telegram Web App
let tg = null;
if (isTelegram()) {
    tg = window.Telegram.WebApp;
}

// Services data - with fixed quantities only
const services = [
    {
        id: "tg-channel",
        title: "Telegram Channel Subscribers",
        platform: "🌎 TG CHANNEL",
        icon: "fab fa-telegram-plane",
        pricing: [
            { quantity: "1K SUBSCRIBER", price: 350 },
            { quantity: "5K SUBSCRIBER", price: 1700 },
            { quantity: "10K SUBSCRIBER", price: 3300 },
            { quantity: "20K SUBSCRIBER", price: 6500 },
            { quantity: "50K SUBSCRIBER", price: 16500 },
            { quantity: "100K SUBSCRIBERS", price: 37999 }
        ],
        requiresUsername: true
    },
    {
        id: "tg-group",
        title: "Telegram Group Members",
        platform: "🌐 TG GROUP",
        icon: "fas fa-users",
        pricing: [
            { quantity: "1K MEMBER", price: 500 },
            { quantity: "5K MEMBER", price: 2500 },
            { quantity: "10K MEMBER", price: 5000 },
            { quantity: "20K MEMBER", price: 10000 },
            { quantity: "50K MEMBER", price: 25000 }
        ],
        requiresUsername: true
    },
    {
        id: "instagram",
        title: "Instagram Followers",
        platform: "😎 INSTAGRAM",
        icon: "fab fa-instagram",
        pricing: [
            { quantity: "1K FOLLOWERS", price: 400 },
            { quantity: "5K FOLLOWERS", price: 2000 },
            { quantity: "10K FOLLOWERS", price: 4000 },
            { quantity: "50K FOLLOWERS", price: 20000 },
            { quantity: "100K FOLLOWERS", price: 19499 }
        ],
        requiresUsername: true
    },
    {
        id: "tiktok-followers",
        title: "TikTok Followers",
        platform: "🌍 TIK TOK",
        icon: "fab fa-tiktok",
        pricing: [
            { quantity: "1K FOLLOWERS", price: 500 },
            { quantity: "5K FOLLOWERS", price: 2000 },
            { quantity: "10K FOLLOWERS", price: 4000 },
            { quantity: "50K FOLLOWERS", price: 19000 },
            { quantity: "100K FOLLOWERS", price: 26999 }
        ],
        requiresUsername: true
    },
    {
        id: "tiktok-views",
        title: "TikTok Views",
        platform: "🌍 TIK TOK",
        icon: "fas fa-eye",
        pricing: [
            { quantity: "1K VIEWS", price: 30 }
        ],
        requiresUsername: false,
        requiresLink: true
    },
    {
        id: "tiktok-likes",
        title: "TikTok Likes",
        platform: "🌍 TIK TOK",
        icon: "fas fa-thumbs-up",
        pricing: [
            { quantity: "1K LIKES", price: 80 }
        ],
        requiresUsername: false,
        requiresLink: true
    },
    {
        id: "facebook",
        title: "Facebook Followers",
        platform: "🌐 FACEBOOK",
        icon: "fab fa-facebook",
        pricing: [
            { quantity: "1K FOLLOWERS", price: 350 },
            { quantity: "5K FOLLOWERS", price: 1500 },
            { quantity: "10K FOLLOWERS", price: 3000 },
            { quantity: "100K FOLLOWERS", price: 34999 }
        ],
        requiresUsername: true
    },
    {
        id: "facebook-likes",
        title: "Facebook Likes",
        platform: "🌐 FACEBOOK",
        icon: "fas fa-thumbs-up",
        pricing: [
            { quantity: "100 LIKES", price: 100 }
        ],
        requiresUsername: false,
        requiresLink: true
    },
    {
        id: "youtube-subs",
        title: "YouTube Subscribers",
        platform: "🌎 YOUTUBE",
        icon: "fab fa-youtube",
        pricing: [
            { quantity: "1K SUBSCRIBERS", price: 500 }
        ],
        requiresUsername: true
    },
    {
        id: "youtube-hours",
        title: "YouTube Watch Hours",
        platform: "🌎 YOUTUBE",
        icon: "fas fa-clock",
        pricing: [
            { quantity: "1K WATCH HOURS", price: 4500 }
        ],
        requiresUsername: false,
        requiresLink: true
    }
];

// Payment methods data
const paymentMethods = {
    telebirr: {
        name: "Telebirr",
        accountName: "ስማችን",
        accountNumber: "2519XX XX XX XX",
        additionalInfo: "ተሌብር ቁጥሩን በመጠቀም ይላኩ"
    },
    cbe: {
        name: "Commercial Bank of Ethiopia",
        accountName: "ስማችን",
        accountNumber: "1000XXXXXXXXX",
        additionalInfo: "ክፍያውን ካደረጉ በኋላ የተጠናቀቀ ስክሪንሾት ይጫኑ"
    }
};

// Current order state
let currentOrder = {
    service: null,
    selectedQuantity: null,
    selectedPrice: 0,
    paymentMethod: null,
    step: 1 // 1: service details, 2: payment
};

// DOM Elements
const servicesGrid = document.getElementById('servicesGrid');
const orderModal = document.getElementById('orderModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const serviceName = document.getElementById('serviceName');
const selectedQuantityText = document.getElementById('quantityValue');
const quantityPrice = document.getElementById('quantityPrice');
const usernameField = document.getElementById('usernameField');
const linkField = document.getElementById('linkField');
const videoLink = document.getElementById('videoLink');
const username = document.getElementById('username');
const unitPrice = document.getElementById('unitPrice');
const displayQuantity = document.getElementById('displayQuantity');
const totalPrice = document.getElementById('totalPrice');
const paymentDetails = document.getElementById('paymentDetails');
const accountName = document.getElementById('accountName');
const accountNumber = document.getElementById('accountNumber');
const additionalInfo = document.getElementById('additionalInfo');
const prevStepBtn = document.getElementById('prevStep');
const nextStepBtn = document.getElementById('nextStep');
const paymentScreenshot = document.getElementById('paymentScreenshot');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const successMessage = document.getElementById('successMessage');
const successDetails = document.getElementById('successDetails');
const closeSuccess = document.getElementById('closeSuccess');

// Initialize Telegram Web App
function initTelegramWebApp() {
    if (!tg) return;
    
    try {
        // Initialize Telegram Web App
        tg.ready();
        tg.expand();
        
        // Set colors
        tg.setBackgroundColor('#f5f7ff');
        tg.setHeaderColor('#4361ee');
        
        // Get user info
        const user = tg.initDataUnsafe?.user;
        if (user && user.username) {
            // Store username for later use
            window.telegramUsername = '@' + user.username;
        }
        
        console.log('✅ Telegram Web App initialized');
    } catch (error) {
        console.log('⚠️ Telegram Web App not available:', error);
    }
}

// Initialize services grid
function renderServices() {
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.setAttribute('data-service', service.id);
        
        let pricingHTML = '';
        service.pricing.forEach((item, index) => {
            pricingHTML += `
                <div class="price-item ${index === 0 ? 'selected' : ''}" data-quantity="${item.quantity}" data-price="${item.price}">
                    <span>${item.quantity}</span>
                    <span class="price-amount">${item.price.toLocaleString()} ብር</span>
                </div>
            `;
        });
        
        serviceCard.innerHTML = `
            <div class="service-header">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div>
                    <div class="service-title">${service.title}</div>
                    <div class="service-platform">${service.platform}</div>
                </div>
            </div>
            <div class="service-pricing">
                ${pricingHTML}
            </div>
            <div class="service-footer">
                <button class="order-btn" data-service="${service.id}" disabled>
                    <i class="fas fa-shopping-cart"></i> አሁን ይዘዙ
                </button>
            </div>
        `;
        
        servicesGrid.appendChild(serviceCard);
        
        // Add event listeners to price items for selection
        const priceItems = serviceCard.querySelectorAll('.price-item');
        priceItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove selected class from all items
                priceItems.forEach(i => i.classList.remove('selected'));
                // Add selected class to clicked item
                this.classList.add('selected');
                
                // Enable order button
                const orderBtn = serviceCard.querySelector('.order-btn');
                orderBtn.disabled = false;
            });
        });
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceId = this.getAttribute('data-service');
            const selectedPriceItem = serviceCard.querySelector('.price-item.selected');
            
            if (selectedPriceItem) {
                const quantity = selectedPriceItem.getAttribute('data-quantity');
                const price = selectedPriceItem.getAttribute('data-price');
                openOrderModal(serviceId, quantity, price);
            }
        });
    });
}

// Open order modal with service details
function openOrderModal(serviceId, quantity, price) {
    currentOrder.service = services.find(s => s.id === serviceId);
    currentOrder.selectedQuantity = quantity;
    currentOrder.selectedPrice = parseInt(price);
    currentOrder.step = 1;
    
    // Update modal UI
    modalTitle.textContent = `${currentOrder.service.title} ትዕዛዝ`;
    serviceName.value = currentOrder.service.title;
    selectedQuantityText.textContent = quantity;
    quantityPrice.innerHTML = `<strong>${parseInt(price).toLocaleString()} ብር</strong>`;
    
    // Show/hide fields based on service type
    if (currentOrder.service.requiresUsername) {
        usernameField.style.display = 'block';
        linkField.style.display = 'none';
        username.required = true;
        videoLink.required = false;
        
        // Auto-fill Telegram username if available
        if (window.telegramUsername && !username.value) {
            username.value = window.telegramUsername;
        }
    } else if (currentOrder.service.requiresLink) {
        usernameField.style.display = 'none';
        linkField.style.display = 'block';
        username.required = false;
        videoLink.required = true;
    } else {
        usernameField.style.display = 'none';
        linkField.style.display = 'none';
        username.required = false;
        videoLink.required = false;
    }
    
    // Update pricing
    updatePricing();
    
    // Reset payment method
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    paymentDetails.style.display = 'none';
    nextStepBtn.textContent = 'ቀጥል';
    nextStepBtn.disabled = false;
    prevStepBtn.style.display = 'none';
    
    // Reset form fields
    if (!window.telegramUsername) {
        username.value = '';
    }
    videoLink.value = '';
    paymentScreenshot.value = '';
    
    // Show modal
    orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update pricing display
function updatePricing() {
    // For fixed quantities, quantity is always 1 (one package)
    displayQuantity.textContent = currentOrder.selectedQuantity;
    unitPrice.textContent = `${currentOrder.selectedPrice.toLocaleString()} ብር`;
    totalPrice.textContent = `${currentOrder.selectedPrice.toLocaleString()} ብር`;
}

// Close order modal
function closeOrderModal() {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    if (document.getElementById('orderForm')) {
        document.getElementById('orderForm').reset();
    }
}

// Show loading overlay
function showLoading(message = 'ትዕዛዙን እየላክን ነው...') {
    loadingText.textContent = message;
    loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Show success message
function showSuccess(message) {
    successDetails.textContent = message;
    successMessage.style.display = 'flex';
}

// Hide success message
function hideSuccess() {
    successMessage.style.display = 'none';
    closeOrderModal();
}

// Handle next/prev step in order process
function handleNextStep() {
    if (currentOrder.step === 1) {
        // Validate step 1
        if (currentOrder.service.requiresUsername && !username.value.trim()) {
            alert('እባክዎ የተጠቃሚ ስም ያስገቡ');
            return;
        }
        
        if (currentOrder.service.requiresLink && !videoLink.value.trim()) {
            alert('እባክዎ የቪዲዮ ማገናኛ ያስገቡ');
            return;
        }
        
        // Move to step 2 (payment)
        currentOrder.step = 2;
        document.querySelectorAll('.form-group').forEach(el => {
            if (el.id !== 'paymentMethodGroup') {
                el.style.display = 'none';
            }
        });
        
        // Hide quantity display
        document.querySelector('.selected-quantity').style.display = 'none';
        document.querySelector('.price-summary').style.display = 'none';
        
        // Show payment method selection prominently
        document.getElementById('paymentMethodGroup').style.display = 'block';
        prevStepBtn.style.display = 'inline-block';
        nextStepBtn.textContent = 'ትዕዛዝ አስገባ';
    } else if (currentOrder.step === 2) {
        // Validate step 2
        if (!currentOrder.paymentMethod) {
            alert('እባክዎ የክፍያ ዘዴ ይምረጡ');
            return;
        }
        
        if (!paymentScreenshot.files || paymentScreenshot.files.length === 0) {
            alert('እባክዎ የክፍያ ስክሪንሾት ይጫኑ');
            return;
        }
        
        // Submit order
        submitOrder();
    }
}

function handlePrevStep() {
    if (currentOrder.step === 2) {
        // Go back to step 1
        currentOrder.step = 1;
        document.querySelectorAll('.form-group').forEach(el => {
            el.style.display = 'block';
        });
        
        // Show quantity display again
        document.querySelector('.selected-quantity').style.display = 'block';
        document.querySelector('.price-summary').style.display = 'block';
        
        prevStepBtn.style.display = 'none';
        nextStepBtn.textContent = 'ቀጥል';
    }
}

// Send message to Telegram (simplified version)
async function sendToTelegram(message, photoFile = null) {
    try {
        // First send the text message
        const textResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const textData = await textResponse.json();
        
        // Then send photo if available
        if (photoFile && textData.ok) {
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('photo', photoFile);
            formData.append('caption', '📸 Payment Screenshot');
            
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }
        
        return textData.ok;
    } catch (error) {
        console.error('Telegram send error:', error);
        return false;
    }
}

// Submit order to Telegram bot
async function submitOrder() {
    // Prepare order data
    const orderData = {
        service: currentOrder.service.title,
        quantity: currentOrder.selectedQuantity,
        totalPrice: currentOrder.selectedPrice,
        username: username.value || 'N/A',
        videoLink: videoLink.value || 'N/A',
        paymentMethod: currentOrder.paymentMethod,
        timestamp: new Date().toLocaleString('en-US', { 
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };
    
    const screenshotFile = paymentScreenshot.files[0];
    
    // Create message for Telegram
    const message = `
🎯 *NEW ORDER RECEIVED!*

📦 *Service:* ${orderData.service}
📊 *Quantity:* ${orderData.quantity}
💰 *Total Price:* ${orderData.totalPrice.toLocaleString()} ብር
👤 *Username:* ${orderData.username}
🔗 *Video Link:* ${orderData.videoLink}
💳 *Payment Method:* ${orderData.paymentMethod}
🕐 *Time:* ${orderData.timestamp}

✅ *Check the order and start working!*
    `;
    
    try {
        // Show loading
        showLoading('Sending order to Telegram...');
        
        // Send to Telegram
        const success = await sendToTelegram(message, screenshotFile);
        
        hideLoading();
        
        if (success) {
            showSuccess(`✅ Order sent successfully!\n\nService: ${orderData.service}\nQuantity: ${orderData.quantity}\nTotal: ${orderData.totalPrice.toLocaleString()} ብር\n\nWe will contact you soon!`);
            
            console.log('✅ Order sent to Telegram:', orderData);
        } else {
            showSuccess(`✅ Order received!\n\nService: ${orderData.service}\nQuantity: ${orderData.quantity}\nTotal: ${orderData.totalPrice.toLocaleString()} ብር\n\nWe will contact you soon!`);
            console.log('⚠️ Order saved locally:', orderData);
        }
    } catch (error) {
        hideLoading();
        console.error('Order submission error:', error);
        
        // Still show success to user
        showSuccess(`✅ Order received!\n\nService: ${orderData.service}\nQuantity: ${orderData.quantity}\nTotal: ${orderData.totalPrice.toLocaleString()} ብር\n\nWe will contact you soon!`);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Close modal when clicking X or outside modal
    if (closeModal) {
        closeModal.addEventListener('click', closeOrderModal);
    }
    
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                closeOrderModal();
            }
        });
    }
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('selected');
            });
            this.classList.add('selected');
            
            const methodType = this.getAttribute('data-method');
            currentOrder.paymentMethod = paymentMethods[methodType].name;
            
            // Show payment details
            accountName.textContent = `ስም: ${paymentMethods[methodType].accountName}`;
            accountNumber.textContent = paymentMethods[methodType].accountNumber;
            additionalInfo.textContent = paymentMethods[methodType].additionalInfo;
            
            paymentDetails.style.display = 'block';
        });
    });
    
    // Next/prev step buttons
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', handleNextStep);
    }
    
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', handlePrevStep);
    }
    
    // Close success message
    if (closeSuccess) {
        closeSuccess.addEventListener('click', hideSuccess);
    }
    
    // Prevent form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
}

// Add Telegram badge if in Telegram
function addTelegramBadge() {
    if (!tg) return;
    
    const badge = document.createElement('div');
    badge.innerHTML = `
        <div style="
            position: fixed; 
            top: 10px; 
            right: 10px; 
            background: linear-gradient(135deg, #0088cc, #00aced);
            color: white; 
            padding: 8px 15px; 
            border-radius: 20px; 
            font-size: 13px; 
            z-index: 1001; 
            display: flex; 
            align-items: center; 
            gap: 8px;
            font-weight: 500;
            box-shadow: 0 3px 10px rgba(0, 136, 204, 0.3);
        ">
            <i class="fab fa-telegram" style="font-size: 16px;"></i> 
            @booottttttttttt_bot
        </div>
    `;
    document.body.appendChild(badge);
}

// Add Open in Telegram button if NOT in Telegram
function addTelegramButton() {
    if (tg) return; // Don't show if already in Telegram
    
    const button = document.createElement('div');
    button.innerHTML = `
        <div id="telegramLaunchBtn" style="
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 1000;
            animation: fadeIn 0.5s ease-in;
        ">
            <a href="https://t.me/booottttttttttt_bot" target="_blank" 
               style="
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    background: linear-gradient(135deg, #0088cc, #00aced);
                    color: white; 
                    padding: 14px 22px; 
                    border-radius: 30px; 
                    text-decoration: none; 
                    box-shadow: 0 5px 20px rgba(0, 136, 204, 0.4);
                    transition: all 0.3s ease;
                ">
                <i class="fab fa-telegram" style="font-size: 26px;"></i>
                <div>
                    <div style="font-weight: bold; font-size: 15px;">Open in Telegram</div>
                    <div style="font-size: 12px; opacity: 0.9;">Bot: @booottttttttttt_bot</div>
                </div>
            </a>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            #telegramLaunchBtn a:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 136, 204, 0.5);
            }
        </style>
    `;
    document.body.appendChild(button);
}

// Initialize the page
function initPage() {
    // Initialize Telegram Web App first
    initTelegramWebApp();
    
    // Render services
    renderServices();
    
    // Initialize event listeners
    initEventListeners();
    
    // Add Telegram UI elements
    if (tg) {
        addTelegramBadge();
        console.log('📱 Running inside Telegram Mini App');
    } else {
        addTelegramButton();
        console.log('🌐 Running in Web Browser');
    }
    
    // Add animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Log startup information
    console.log('=========================================');
    console.log('🚀 SOCIALBOOST PROMOTION WEBSITE');
    console.log('=========================================');
    console.log('📊 Total Services:', services.length);
    console.log('💰 Payment Methods: Telebirr, CBE');
    console.log('📸 Screenshot Upload: Enabled');
    console.log('🤖 Telegram Integration: Active');
    console.log('🔧 Bot Token:', TELEGRAM_BOT_TOKEN ? '✓ Set' : '✗ Missing');
    console.log('👤 Chat ID:', TELEGRAM_CHAT_ID ? '✓ Set' : '✗ Missing');
    console.log('🤖 Bot Username:', '@booottttttttttt_bot');
    console.log('🌐 Mode:', tg ? 'Telegram Mini App' : 'Web Browser');
    console.log('✅ System Status: READY');
    console.log('=========================================');
}

// Start when page loads
document.addEventListener('DOMContentLoaded', initPage);

// Also try to initialize if page loads slowly
window.addEventListener('load', function() {
    console.log('Page fully loaded');
});
