// HubSpot hinnoittelulogiikka
document.addEventListener('DOMContentLoaded', function() {
    // Hinnoitteludata
    const pricing = {
        customerPlatform: {
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

    // DOM elementit
    const elements = {
        modeSelect: document.getElementById('mode'),
        platformTierSelect: document.getElementById('platform-tier'),
        platformUsersInput: document.getElementById('platform-users'),
        customHubSection: document.getElementById('custom-hub-section'),
        platformSection: document.getElementById('platform-section'),
        hubPricesElement: document.getElementById('hub-prices'),
        totalPriceElement: document.getElementById('total-price'),
        marketingTierSelect: document.getElementById('marketing-tier'),
        marketingContactsInput: document.getElementById('marketing-contacts'),
        salesTierSelect: document.getElementById('sales-tier'),
        salesUsersInput: document.getElementById('sales-users'),
        serviceTierSelect: document.getElementById('service-tier'),
        serviceUsersInput: document.getElementById('service-users'),
        contentTierSelect: document.getElementById('content-tier'),
        operationsTierSelect: document.getElementById('operations-tier'),
        tabButtons: document.querySelectorAll('.tab-button'),
        tabContents: document.querySelectorAll('.tab-content')
    };

    // State management
    let state = {
        mode: 'platform',
        platformTier: 'starter',
        platformUsers: 1,
        marketing: {
            tier: 'starter',
            contacts: 1000
        },
        sales: {
            tier: 'starter',
            users: 1
        },
        service: {
            tier: 'starter',
            users: 1
        },
        content: {
            tier: 'starter'
        },
        operations: {
            tier: 'starter'
        }
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
            const tabId = button.dataset.tab;
            
            // Update active states
            elements.tabButtons.forEach(btn => btn.classList.remove('active'));
            elements.tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            button.classList.add('active');
            const activeContent = document.querySelector(`#${tabId}-section`);
            if (activeContent) {
                activeContent.classList.add('active');
                activeContent.style.display = 'block';
            }
            
            // Update state
            state.mode = tabId;
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
        if (elements.customHubSection && elements.platformSection) {
            elements.customHubSection.style.display = 'none';
            elements.platformSection.style.display = 'block';
            elements.platformSection.classList.add('active');
            calculatePrice();
        }
    }

    // Event Listeners
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
        state.marketing.tier = e.target.value;
        calculatePrice();
    });

    elements.marketingContactsInput?.addEventListener('input', (e) => {
        state.marketing.contacts = validateNumberInput(e.target, 1000);
        calculatePrice();
    });

    // Sales Hub listeners
    elements.salesTierSelect?.addEventListener('change', (e) => {
        state.sales.tier = e.target.value;
        calculatePrice();
    });

    elements.salesUsersInput?.addEventListener('input', (e) => {
        state.sales.users = validateNumberInput(e.target, 1);
        calculatePrice();
    });

    // Service Hub listeners
    elements.serviceTierSelect?.addEventListener('change', (e) => {
        state.service.tier = e.target.value;
        calculatePrice();
    });

    elements.serviceUsersInput?.addEventListener('input', (e) => {
        state.service.users = validateNumberInput(e.target, 1);
        calculatePrice();
    });

    // Content & Operations Hub listeners
    elements.contentTierSelect?.addEventListener('change', (e) => {
        state.content.tier = e.target.value;
        calculatePrice();
    });

    elements.operationsTierSelect?.addEventListener('change', (e) => {
        state.operations.tier = e.target.value;
        calculatePrice();
    });

    function calculatePrice() {
        if (!elements.hubPricesElement || !elements.totalPriceElement) return;

        let total = 0;
        elements.hubPricesElement.innerHTML = '';

        if (state.mode === 'platform') {
            const platformPrice = calculatePlatformPrice();
            addPriceElement('HubSpot Customer Platform', platformPrice);
            total = platformPrice;
        } else {
            // Marketing Hub
            const marketingPrice = calculateMarketingPrice();
            if (marketingPrice > 0) {
                addPriceElement('Marketing Hub', marketingPrice);
                total += marketingPrice;
            }

            // Sales Hub
            const salesPrice = calculateSalesPrice();
            if (salesPrice > 0) {
                addPriceElement('Sales Hub', salesPrice);
                total += salesPrice;
            }

            // Service Hub
            const servicePrice = calculateServicePrice();
            if (servicePrice > 0) {
                addPriceElement('Service Hub', servicePrice);
                total += servicePrice;
            }

            // Content Hub
            const contentPrice = calculateContentPrice();
            if (contentPrice > 0) {
                addPriceElement('Content Hub', contentPrice);
                total += contentPrice;
            }

            // Operations Hub
            const operationsPrice = calculateOperationsPrice();
            if (operationsPrice > 0) {
                addPriceElement('Operations Hub', operationsPrice);
                total += operationsPrice;
            }
        }

        elements.totalPriceElement.textContent = `${total.toLocaleString('fi-FI')} €/kk`;
    }

    function calculatePlatformPrice() {
        const tier = pricing.customerPlatform[state.platformTier];
        if (!tier) return 0;
        
        if (state.platformTier === 'starter') {
            return tier.base + (state.platformUsers * tier.extraPerUser);
        } else {
            const extraUsers = Math.max(0, state.platformUsers - tier.includedUsers);
            return tier.base + (extraUsers * tier.extraPerUser);
        }
    }

    function calculateMarketingPrice() {
        const tier = pricing.marketing[state.marketing.tier];
        if (!tier) return 0;
        
        const extraContacts = Math.max(0, state.marketing.contacts - tier.includedContacts);
        const extraBlocks = Math.ceil(extraContacts / tier.extraUnit);
        return tier.base + (extraBlocks * tier.extraCost);
    }

    function calculateSalesPrice() {
        const tier = pricing.sales[state.sales.tier];
        if (!tier) return 0;
        
        return tier.base + ((state.sales.users - 1) * tier.extraPerUser);
    }

    function calculateServicePrice() {
        const tier = pricing.service[state.service.tier];
        if (!tier) return 0;
        
        return tier.base + ((state.service.users - 1) * tier.extraPerUser);
    }

    function calculateContentPrice() {
        const tier = pricing.content[state.content.tier];
        return tier ? tier.base : 0;
    }

    function calculateOperationsPrice() {
        const tier = pricing.operations[state.operations.tier];
        return tier ? tier.base : 0;
    }

    function addPriceElement(label, price) {
        if (!elements.hubPricesElement) return;

        const priceElement = document.createElement('div');
        priceElement.className = 'hub-price';
        priceElement.innerHTML = `
            <span class="hub-name">${label} (${capitalizeFirstLetter(state.mode === 'platform' ? state.platformTier : getHubTier(label))})</span>
            <span>${price.toLocaleString('fi-FI')} €/kk</span>
        `;
        elements.hubPricesElement.appendChild(priceElement);
    }

    function getHubTier(hubLabel) {
        switch(hubLabel) {
            case 'Marketing Hub': return state.marketing.tier;
            case 'Sales Hub': return state.sales.tier;
            case 'Service Hub': return state.service.tier;
            case 'Content Hub': return state.content.tier;
            case 'Operations Hub': return state.operations.tier;
            default: return '';
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize the form
    initializeForm();
}); 