// HubSpot hinnoittelulogiikka
document.addEventListener('DOMContentLoaded', function() {
    // Hinnoitteludata
    const pricing = {
        platform: {
            starter: { base: 0, extraPerUser: 15 },
            professional: { base: 1283, includedUsers: 5, extraPerUser: 45 },
            enterprise: { base: 4610, includedUsers: 7, extraPerUser: 75 }
        },
        marketing: {
            starter: { base: 50, includedContacts: 1000, extraUnit: 1000, extraCost: 46 },
            professional: { base: 890, includedContacts: 5000, extraUnit: 5000, extraCost: 250 },
            enterprise: { base: 3200, includedContacts: 10000, extraUnit: 10000, extraCost: 92 }
        },
        sales: {
            starter: { base: 50, extraPerUser: 15 },
            professional: { base: 450, extraPerUser: 80 },
            enterprise: { base: 1200, extraPerUser: 120 }
        },
        service: {
            starter: { base: 50, extraPerUser: 15 },
            professional: { base: 450, extraPerUser: 80 },
            enterprise: { base: 1200, extraPerUser: 120 }
        },
        content: {
            starter: { base: 50 },
            professional: { base: 450 },
            enterprise: { base: 1200 }
        },
        operations: {
            starter: { base: 50 },
            professional: { base: 800 },
            enterprise: { base: 2000 }
        }
    };

    // DOM Elements
    const elements = {
        platformSection: document.getElementById('platform-section'),
        customHubSection: document.getElementById('custom-hub-section'),
        tabButtons: document.querySelectorAll('.tab-button'),
        tabContents: document.querySelectorAll('.tab-content'),
        hubPricesElement: document.getElementById('hub-prices'),
        totalPriceElement: document.getElementById('total-price'),
        modeSelect: document.getElementById('mode'),
        platformTierSelect: document.getElementById('platform-tier'),
        platformUsersInput: document.getElementById('platform-users'),
        marketingTierSelect: document.getElementById('marketing-tier'),
        marketingContactsInput: document.getElementById('marketing-contacts'),
        salesTierSelect: document.getElementById('sales-tier'),
        salesUsersInput: document.getElementById('sales-users'),
        serviceTierSelect: document.getElementById('service-tier'),
        serviceUsersInput: document.getElementById('service-users'),
        contentTierSelect: document.getElementById('content-tier'),
        operationsTierSelect: document.getElementById('operations-tier')
    };

    // State management
    const state = {
        mode: 'platform',
        platformTier: 'starter',
        platformUsers: 1,
        marketingTier: 'starter',
        marketingContacts: 1000,
        salesTier: 'starter',
        salesUsers: 1,
        serviceTier: 'starter',
        serviceUsers: 1,
        contentTier: 'starter',
        operationsTier: 'starter'
    };

    // Input validation
    function validateNumberInput(input, min, max) {
        const value = parseInt(input.value);
        if (isNaN(value)) {
            input.value = min;
            return min;
        }
        if (value < min) {
            input.value = min;
            return min;
        }
        if (max && value > max) {
            input.value = max;
            return max;
        }
        return value;
    }

    // Tab functionality
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Update active states
            elements.tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
            elements.tabContents.forEach(content => {
                content.classList.toggle('active', content.id === `${tab}-section`);
                content.style.display = content.id === `${tab}-section` ? 'block' : 'none';
            });
            
            // Update state
            state.mode = tab;
            
            // Recalculate price
            calculatePrice();
        });
    });

    // Initialize tooltips for better accessibility
    const tooltips = document.querySelectorAll('.tooltip-trigger');
    tooltips.forEach(tooltip => {
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('tabindex', '0');
        
        // Handle keyboard interaction
        tooltip.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tooltip.classList.add('tooltip-visible');
            }
        });
        
        tooltip.addEventListener('blur', () => {
            tooltip.classList.remove('tooltip-visible');
        });
    });

    // Enhance form interactions
    const formInputs = document.querySelectorAll('input[type="number"]');
    formInputs.forEach(input => {
        // Add increment/decrement buttons
        const wrapper = document.createElement('div');
        wrapper.className = 'number-input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const decrementBtn = document.createElement('button');
        decrementBtn.className = 'number-btn decrement';
        decrementBtn.textContent = '-';
        decrementBtn.type = 'button';
        
        const incrementBtn = document.createElement('button');
        incrementBtn.className = 'number-btn increment';
        incrementBtn.textContent = '+';
        incrementBtn.type = 'button';

        wrapper.insertBefore(decrementBtn, input);
        wrapper.appendChild(incrementBtn);

        // Handle button clicks
        decrementBtn.addEventListener('click', () => {
            const min = parseInt(input.min) || 0;
            const step = parseInt(input.step) || 1;
            const newValue = Math.max(min, parseInt(input.value) - step);
            input.value = newValue;
            input.dispatchEvent(new Event('input'));
        });

        incrementBtn.addEventListener('click', () => {
            const step = parseInt(input.step) || 1;
            const newValue = parseInt(input.value) + step;
            input.value = newValue;
            input.dispatchEvent(new Event('input'));
        });

        // Handle direct input
        input.addEventListener('input', () => {
            const min = parseInt(input.min) || 0;
            const max = parseInt(input.max) || Infinity;
            validateNumberInput(input, min, max);
        });
    });

    // Initialize form
    function initializeForm() {
        // Set initial display states
        if (elements.customHubSection && elements.platformSection) {
            elements.customHubSection.style.display = 'none';
            elements.platformSection.style.display = 'block';
            
            // Set initial active states
            elements.tabButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === 'platform');
            });
            elements.tabContents.forEach(content => {
                content.classList.toggle('active', content.id === 'platform-section');
            });
            
            // Set initial state
            state.mode = 'platform';
            
            // Calculate initial price
            calculatePrice();
        }
    }

    // Platform Hub listeners
    elements.platformTierSelect?.addEventListener('change', (e) => {
        state.platformTier = e.target.value;
        calculatePrice();
    });

    elements.platformUsersInput?.addEventListener('input', (e) => {
        state.platformUsers = validateNumberInput(e.target, 1);
        calculatePrice();
    });

    // Marketing Hub listeners
    elements.marketingTierSelect?.addEventListener('change', (e) => {
        state.marketingTier = e.target.value;
        calculatePrice();
    });

    elements.marketingContactsInput?.addEventListener('input', (e) => {
        state.marketingContacts = validateNumberInput(e.target, 1000);
        calculatePrice();
    });

    // Sales Hub listeners
    elements.salesTierSelect?.addEventListener('change', (e) => {
        state.salesTier = e.target.value;
        calculatePrice();
    });

    elements.salesUsersInput?.addEventListener('input', (e) => {
        state.salesUsers = validateNumberInput(e.target, 1);
        calculatePrice();
    });

    // Service Hub listeners
    elements.serviceTierSelect?.addEventListener('change', (e) => {
        state.serviceTier = e.target.value;
        calculatePrice();
    });

    elements.serviceUsersInput?.addEventListener('input', (e) => {
        state.serviceUsers = validateNumberInput(e.target, 1);
        calculatePrice();
    });

    // Content & Operations Hub listeners
    elements.contentTierSelect?.addEventListener('change', (e) => {
        state.contentTier = e.target.value;
        calculatePrice();
    });

    elements.operationsTierSelect?.addEventListener('change', (e) => {
        state.operationsTier = e.target.value;
        calculatePrice();
    });

    function calculatePrice() {
        let totalPrice = 0;
        let hubPrices = [];

        if (state.mode === 'platform') {
            totalPrice = calculatePlatformPrice();
            hubPrices.push({
                name: 'HubSpot Platform',
                price: totalPrice
            });
        } else {
            // Calculate individual hub prices
            const marketingPrice = calculateMarketingPrice();
            const salesPrice = calculateSalesPrice();
            const servicePrice = calculateServicePrice();
            const contentPrice = calculateContentPrice();
            const operationsPrice = calculateOperationsPrice();

            totalPrice = marketingPrice + salesPrice + servicePrice + contentPrice + operationsPrice;

            // Add non-zero prices to the list
            if (marketingPrice > 0) hubPrices.push({ name: 'Marketing Hub', price: marketingPrice });
            if (salesPrice > 0) hubPrices.push({ name: 'Sales Hub', price: salesPrice });
            if (servicePrice > 0) hubPrices.push({ name: 'Service Hub', price: servicePrice });
            if (contentPrice > 0) hubPrices.push({ name: 'Content Hub', price: contentPrice });
            if (operationsPrice > 0) hubPrices.push({ name: 'Operations Hub', price: operationsPrice });
        }

        // Update UI
        updatePriceDisplay(totalPrice, hubPrices);
    }

    function calculatePlatformPrice() {
        const tier = pricing.platform[state.platformTier];
        if (!tier) return 0;
        
        if (state.platformTier === 'starter') {
            return tier.base + (state.platformUsers * tier.extraPerUser);
        } else {
            const extraUsers = Math.max(0, state.platformUsers - tier.includedUsers);
            return tier.base + (extraUsers * tier.extraPerUser);
        }
    }

    function calculateMarketingPrice() {
        const tier = pricing.marketing[state.marketingTier];
        if (!tier) return 0;
        
        const extraContacts = Math.max(0, state.marketingContacts - tier.includedContacts);
        const extraBlocks = Math.ceil(extraContacts / tier.extraUnit);
        return tier.base + (extraBlocks * tier.extraCost);
    }

    function calculateSalesPrice() {
        const tier = pricing.sales[state.salesTier];
        if (!tier) return 0;
        return tier.base + ((state.salesUsers - 1) * tier.extraPerUser);
    }

    function calculateServicePrice() {
        const tier = pricing.service[state.serviceTier];
        if (!tier) return 0;
        return tier.base + ((state.serviceUsers - 1) * tier.extraPerUser);
    }

    function calculateContentPrice() {
        const tier = pricing.content[state.contentTier];
        return tier ? tier.base : 0;
    }

    function calculateOperationsPrice() {
        const tier = pricing.operations[state.operationsTier];
        return tier ? tier.base : 0;
    }

    function updatePriceDisplay(totalPrice, hubPrices) {
        if (elements.hubPricesElement && elements.totalPriceElement) {
            // Format hub prices
            const hubPricesHtml = hubPrices.map(hub => `
                <div class="hub-price">
                    <span class="hub-name">${hub.name}</span>
                    <span class="hub-price-value">${formatPrice(hub.price)}</span>
                </div>
            `).join('');

            // Update the display
            elements.hubPricesElement.innerHTML = hubPricesHtml;
            elements.totalPriceElement.textContent = formatPrice(totalPrice);
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('fi-FI', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Initialize the form
    initializeForm();
}); 