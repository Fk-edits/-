// Telegram Bot Configuration
const BOT_TOKEN = "8315292904:AAFmZCo7lSH_xrTbvnc_OJ5wC4BNxwWbRm8";
const ADMIN_ID = "7570614168";

// Services Data with proper types
const services = {
    telegram: {
        title: "Telegram Channel",
        icon: "fab fa-telegram",
        type: "channel",
        items: [
            { label: "1K SUBSCRIBERS", price: 350, type: "subscriber" },
            { label: "5K SUBSCRIBERS", price: 1700, type: "subscriber" },
            { label: "10K SUBSCRIBERS", price: 3300, type: "subscriber" },
            { label: "20K SUBSCRIBERS", price: 6500, type: "subscriber" },
            { label: "50K SUBSCRIBERS", price: 16500, type: "subscriber" },
            { label: "100K SUBSCRIBERS", price: 37999, type: "subscriber" }
        ]
    },
    telegramGroup: {
        title: "Telegram Group",
        icon: "fas fa-users",
        type: "group",
        items: [
            { label: "1K MEMBERS", price: 500, type: "member" },
            { label: "5K MEMBERS", price: 2500, type: "member" },
            { label: "10K MEMBERS", price: 5000, type: "member" },
            { label: "20K MEMBERS", price: 10000, type: "member" },
            { label: "50K MEMBERS", price: 25000, type: "member" }
        ]
    },
    instagram: {
        title: "Instagram",
        icon: "fab fa-instagram",
        type: "profile",
        items: [
            { label: "1K FOLLOWERS", price: 400, type: "follower" },
            { label: "5K FOLLOWERS", price: 2000, type: "follower" },
            { label: "10K FOLLOWERS", price: 4000, type: "follower" },
            { label: "50K FOLLOWERS", price: 20000, type: "follower" },
            { label: "100K FOLLOWERS", price: 19499, type: "follower" }
        ]
    },
    tiktok: {
        title: "TikTok",
        icon: "fab fa-tiktok",
        type: "profile",
        items: [
            { label: "1K FOLLOWERS", price: 500, type: "follower" },
            { label: "5K FOLLOWERS", price: 2000, type: "follower" },
            { label: "10K FOLLOWERS", price: 4000, type: "follower" },
            { label: "50K FOLLOWERS", price: 19000, type: "follower" },
            { label: "100K FOLLOWERS", price: 26999, type: "follower" },
            { label: "1K VIEWS", price: 30, type: "view" },
            { label: "1K LIKES", price: 80, type: "like" }
        ]
    },
    facebook: {
        title: "Facebook",
        icon: "fab fa-facebook",
        type: "page",
        items: [
            { label: "1K FOLLOWERS", price: 350, type: "follower" },
            { label: "5K FOLLOWERS", price: 1500, type: "follower" },
            { label: "10K FOLLOWERS", price: 3000, type: "follower" },
            { label: "100K FOLLOWERS", price: 34999, type: "follower" },
            { label: "100 LIKES", price: 100, type: "like" }
        ]
    },
    youtube: {
        title: "YouTube",
        icon: "fab fa-youtube",
        type: "channel",
        items: [
            { label: "1K SUBSCRIBERS", price: 500, type: "subscriber" },
            { label: "1K WATCH HOURS", price: 4500, type: "watch_hours" }
        ]
    }
};

// Current order state
let currentOrder = {
    service: null,
    item: null,
    quantity: 1,
    username: '',
    link: '',
    paymentMethod: null,
    totalPrice: 0,
    orderId: null,
    orderTime: null,
    requiresVideoLink: false
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    setupEventListeners();
});

// Render all services to the grid
function renderServices() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';

    for (const [key, service] of Object.entries(services)) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-header">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-title">${service.title}</div>
            </div>
            <ul class="service-list">
                ${service.items.map(item => `
                    <li class="service-item">
                        <span>${item.label}</span>
                        <span class="price-tag">${item.price.toLocaleString()} ብር</span>
                    </li>
                `).join('')}
            </ul>
            <button class="btn btn-primary order-service-btn" data-service="${key}">
                <i class="fas fa-shopping-cart"></i> Order Now
            </button>
        `;
        container.appendChild(card);
    }

    // Add click listeners to order buttons
    document.querySelectorAll('.order-service-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceKey = this.dataset.service;
            openOrderModal(serviceKey);
        });
    });
}

// Open order modal with selected service
function openOrderModal(serviceKey) {
    currentOrder.service = serviceKey;
    currentOrder.orderId = generateOrderId();
    currentOrder.orderTime = new Date();
    
    const service = services[serviceKey];
    document.getElementById('modalTitle').innerHTML = `<i class="fas fa-shopping-cart"></i> Order ${service.title}`;
    
    // Reset modal to step 1
    showStep(1);
    updateStepIndicator(1);
    
    // Populate service options
    const serviceTypeSelect = document.getElementById('serviceType');
    serviceTypeSelect.innerHTML = '';
    
    service.items.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${item.label} - ${item.price.toLocaleString()} ብር`;
        option.dataset.type = item.type;
        option.dataset.label = item.label;
        serviceTypeSelect.appendChild(option);
    });
    
    // Initialize price calculation
    updatePrice();
    
    // Show modal
    document.getElementById('orderModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Show specific step in the modal
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show selected step
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update step indicator
    updateStepIndicator(stepNumber);
}

// Update step indicator dots
function updateStepIndicator(stepNumber) {
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < stepNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Update price calculation
function updatePrice() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const priceDetails = document.getElementById('priceDetails');
    
    const service = services[currentOrder.service];
    const selectedIndex = parseInt(serviceTypeSelect.value) || 0;
    const selectedItem = service.items[selectedIndex];
    const quantity = parseInt(quantityInput.value) || 1;
    const total = selectedItem.price * quantity;
    
    // Update current order
    currentOrder.item = selectedItem;
    currentOrder.quantity = quantity;
    currentOrder.totalPrice = total;
    currentOrder.requiresVideoLink = selectedItem.type === 'view' || selectedItem.type === 'like';
    
    // Update display
    totalPriceElement.textContent = `${total.toLocaleString()} ብር`;
    priceDetails.textContent = `${selectedItem.price.toLocaleString()} ብር × ${quantity} = ${total.toLocaleString()} ብር`;
    
    // Update Telebirr amount display
    const telebirrAmount = document.getElementById('telebirrAmount');
    if (telebirrAmount) {
        telebirrAmount.textContent = `${total.toLocaleString()} ብር`;
    }
}

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp.slice(-8)}${random}`;
}

// Show toast notification
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    toast.className = `toast ${type} show`;
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Update order summary display
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const finalPrice = document.getElementById('finalPrice');
    const service = services[currentOrder.service];
    
    // Get the correct service label based on type
    let serviceTypeLabel = currentOrder.item.label;
    
    orderSummary.innerHTML = `
        <p><strong>Service:</strong> ${service.title}</p>
        <p><strong>Package:</strong> ${serviceTypeLabel}</p>
        <p><strong>Quantity:</strong> ${currentOrder.quantity} ${getQuantityUnit(currentOrder.item.type)}</p>
        <p><strong>Unit Price:</strong> ${currentOrder.item.price.toLocaleString()} ብር</p>
    `;
    
    finalPrice.textContent = `${currentOrder.totalPrice.toLocaleString()} ብር`;
}

// Get appropriate unit for quantity display
function getQuantityUnit(itemType) {
    const units = {
        'subscriber': 'K subscribers',
        'member': 'K members',
        'follower': 'K followers',
        'view': 'K views',
        'like': 'K likes',
        'watch_hours': 'K watch hours'
    };
    return units[itemType] || '';
}

// Get appropriate service description for Telegram
function getServiceDescription(serviceTitle, itemType, itemLabel) {
    const descriptions = {
        'Telegram Channel': {
            'subscriber': 'Telegram Channel Subscribers'
        },
        'Telegram Group': {
            'member': 'Telegram Group Members'
        },
        'Instagram': {
            'follower': 'Instagram Followers'
        },
        'TikTok': {
            'follower': 'TikTok Followers',
            'view': 'TikTok Views',
            'like': 'TikTok Likes'
        },
        'Facebook': {
            'follower': 'Facebook Followers',
            'like': 'Facebook Likes'
        },
        'YouTube': {
            'subscriber': 'YouTube Subscribers',
            'watch_hours': 'YouTube Watch Hours'
        }
    };
    
    return descriptions[serviceTitle]?.[itemType] || itemLabel;
}

// Setup all event listeners
function setupEventListeners() {
    // Price calculation listeners
    document.getElementById('serviceType').addEventListener('change', function() {
        updatePrice();
        updateUsernameLabel();
    });
    
    document.getElementById('quantity').addEventListener('input', updatePrice);
    
    // Step 1: Continue button
    document.getElementById('continueBtn').addEventListener('click', function() {
        updateOrderSummary();
        updateUsernameLabel();
        showStep(2);
    });
    
    // Step 2: Back button
    document.getElementById('backBtn1').addEventListener('click', function() {
        showStep(1);
    });
    
    // Step 2: Continue to payment
    document.getElementById('continueToPayment').addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        
        if (!username) {
            showToast('Error', 'Please enter your username/link', 'error');
            return;
        }
        
        currentOrder.username = username;
        
        // Only get video link if needed
        if (currentOrder.requiresVideoLink) {
            const videoLink = document.getElementById('videoLink').value.trim();
            if (!videoLink) {
                showToast('Error', 'Please enter video link for this service', 'error');
                return;
            }
            currentOrder.link = videoLink;
        }
        
        showStep(3);
    });
    
    // Payment method selection
    document.querySelectorAll('.payment-method-card').forEach(method => {
        method.addEventListener('click', function() {
            // Remove previous selection
            document.querySelectorAll('.payment-method-card').forEach(m => {
                m.classList.remove('selected');
            });
            
            // Add selection to clicked method
            this.classList.add('selected');
            currentOrder.paymentMethod = this.dataset.method;
            
            // Hide all account details
            document.querySelectorAll('.account-details-card').forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Show selected payment method details
            const detailsId = `${currentOrder.paymentMethod}Details`;
            document.getElementById(detailsId).classList.add('active');
        });
    });
    
    // Step 3: Back button
    document.getElementById('backBtn2').addEventListener('click', function() {
        showStep(2);
    });
    
    // Step 3: Submit order
    document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);
    
    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('orderModal').classList.contains('active')) {
            closeModal();
        }
    });
}

// Update username label based on service type
function updateUsernameLabel() {
    const usernameLabel = document.getElementById('usernameLabel');
    const videoLinkGroup = document.getElementById('videoLinkGroup');
    const selectedOption = document.getElementById('serviceType').selectedOptions[0];
    const itemType = selectedOption.dataset.type;
    
    // Show/hide video link field
    if (itemType === 'view' || itemType === 'like') {
        videoLinkGroup.style.display = 'block';
        usernameLabel.innerHTML = '<i class="fas fa-user"></i> Video Owner Username:';
    } else {
        videoLinkGroup.style.display = 'none';
        
        // Set appropriate label based on service
        const service = services[currentOrder.service];
        if (service.type === 'channel' || service.type === 'page') {
            usernameLabel.innerHTML = '<i class="fas fa-link"></i> Channel/Page Link:';
        } else if (itemType === 'watch_hours') {
            usernameLabel.innerHTML = '<i class="fas fa-link"></i> YouTube Channel Link:';
        } else {
            usernameLabel.innerHTML = '<i class="fas fa-user"></i> Username/Profile Link:';
        }
    }
}

// Submit order to Telegram
async function submitOrder() {
    const submitBtn = document.getElementById('submitOrderBtn');
    const screenshotInput = document.getElementById('paymentScreenshot');
    
    // Validation
    if (!currentOrder.paymentMethod) {
        showToast('Error', 'Please select a payment method', 'error');
        return;
    }
    
    if (!screenshotInput.files[0]) {
        showToast('Error', 'Please upload payment screenshot', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Get service description for Telegram
        const service = services[currentOrder.service];
        const serviceDescription = getServiceDescription(service.title, currentOrder.item.type, currentOrder.item.label);
        const quantityUnit = getQuantityUnit(currentOrder.item.type);
        
        // Format time
        const orderTime = currentOrder.orderTime.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        
        // Create order message for Telegram
        const orderMessage = `🎯 NEW ORDER RECEIVED!

🆔 Order ID: ${currentOrder.orderId}
📦 Service: ${service.title} - ${serviceDescription}
📊 Quantity: ${currentOrder.quantity} ${quantityUnit}
💰 Total Price: ${currentOrder.totalPrice.toLocaleString()} ብር
👤 Username: ${currentOrder.username}
🔗 ${currentOrder.requiresVideoLink ? 'Video Link' : 'Profile Link'}: ${currentOrder.link || currentOrder.username}
💳 Payment Method: ${currentOrder.paymentMethod.toUpperCase()}
🕐 Time: ${orderTime}

✅ Check the order and start working!`;
        
        console.log('Sending to Telegram:', orderMessage);
        
        // Send to Telegram using test function
        const success = await sendToTelegram(orderMessage);
        
        if (success) {
            // Show success step
            document.getElementById('orderIdDisplay').textContent = currentOrder.orderId;
            document.getElementById('orderTime').textContent = orderTime;
            showStep(4);
            showToast('Success!', `Order ${currentOrder.orderId} submitted successfully`);
        } else {
            throw new Error('Failed to send to Telegram');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Error', 'Failed to submit order. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Test Telegram function (your working function)
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const params = `chat_id=${ADMIN_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`;
    
    try {
        const response = await fetch(url + '?' + params);
        const data = await response.json();
        console.log('Telegram Response:', data);
        return data.ok;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// Close modal and reset form
function closeModal() {
    // Hide modal
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form fields
    document.getElementById('username').value = '';
    document.getElementById('videoLink').value = '';
    document.getElementById('paymentScreenshot').value = '';
    document.getElementById('quantity').value = '1';
    
    // Reset payment selection
    document.querySelectorAll('.payment-method-card').forEach(m => {
        m.classList.remove('selected');
    });
    document.querySelectorAll('.account-details-card').forEach(d => {
        d.classList.remove('active');
    });
    
    // Reset current order
    currentOrder = {
        service: null,
        item: null,
        quantity: 1,
        username: '',
        link: '',
        paymentMethod: null,
        totalPrice: 0,
        orderId: null,
        orderTime: null,
        requiresVideoLink: false
    };
    
    // Reset to step 1
    showStep(1);
}

