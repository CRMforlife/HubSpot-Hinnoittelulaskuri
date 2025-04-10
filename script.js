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
    const modeSelect = document.getElementById('mode');
    const platformTierSelect = document.getElementById('platform-tier');
    const platformUsersInput = document.getElementById('platform-users');
    const customHubSection = document.getElementById('custom-hub-section');
    const platformSection = document.getElementById('platform-section');
    const hubPricesElement = document.getElementById('hub-prices');
    const totalPriceElement = document.getElementById('total-price');
    
    // Marketing Hub inputs
    const marketingTierSelect = document.getElementById('marketing-tier');
    const marketingContactsInput = document.getElementById('marketing-contacts');
    
    // Sales Hub inputs
    const salesTierSelect = document.getElementById('sales-tier');
    const salesUsersInput = document.getElementById('sales-users');
    
    // Service Hub inputs
    const serviceTierSelect = document.getElementById('service-tier');
    const serviceUsersInput = document.getElementById('service-users');
    
    // Content & Operations Hub inputs
    const contentTierSelect = document.getElementById('content-tier');
    const operationsTierSelect = document.getElementById('operations-tier');

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

    // Initialize form
    function initializeForm() {
        customHubSection.style.display = 'none';
        platformSection.style.display = 'block';
        calculatePrice();
    }

    // Event Listeners
    modeSelect.addEventListener('change', (e) => {
        state.mode = e.target.value;
        customHubSection.style.display = state.mode === 'custom' ? 'block' : 'none';
        platformSection.style.display = state.mode === 'platform' ? 'block' : 'none';
        calculatePrice();
    });

    platformTierSelect.addEventListener('change', (e) => {
        state.platformTier = e.target.value;
        calculatePrice();
    });

    platformUsersInput.addEventListener('input', (e) => {
        state.platformUsers = Math.max(1, parseInt(e.target.value) || 1);
        calculatePrice();
    });

    // Marketing Hub listeners
    marketingTierSelect.addEventListener('change', (e) => {
        state.marketing.tier = e.target.value;
        calculatePrice();
    });

    marketingContactsInput.addEventListener('input', (e) => {
        state.marketing.contacts = Math.max(1000, parseInt(e.target.value) || 1000);
        calculatePrice();
    });

    // Sales Hub listeners
    salesTierSelect.addEventListener('change', (e) => {
        state.sales.tier = e.target.value;
        calculatePrice();
    });

    salesUsersInput.addEventListener('input', (e) => {
        state.sales.users = Math.max(1, parseInt(e.target.value) || 1);
        calculatePrice();
    });

    // Service Hub listeners
    serviceTierSelect.addEventListener('change', (e) => {
        state.service.tier = e.target.value;
        calculatePrice();
    });

    serviceUsersInput.addEventListener('input', (e) => {
        state.service.users = Math.max(1, parseInt(e.target.value) || 1);
        calculatePrice();
    });

    // Content & Operations Hub listeners
    contentTierSelect.addEventListener('change', (e) => {
        state.content.tier = e.target.value;
        calculatePrice();
    });

    operationsTierSelect.addEventListener('change', (e) => {
        state.operations.tier = e.target.value;
        calculatePrice();
    });

    function calculatePrice() {
        let total = 0;
        hubPricesElement.innerHTML = '';

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

        totalPriceElement.textContent = `${total.toLocaleString('fi-FI')} €/kk`;
    }

    function calculatePlatformPrice() {
        const tier = pricing.customerPlatform[state.platformTier];
        if (state.platformTier === 'starter') {
            return tier.base + (state.platformUsers * tier.extraPerUser);
        } else {
            const extraUsers = Math.max(0, state.platformUsers - tier.includedUsers);
            return tier.base + (extraUsers * tier.extraPerUser);
        }
    }

    function calculateMarketingPrice() {
        const tier = pricing.marketing[state.marketing.tier];
        const extraContacts = Math.max(0, state.marketing.contacts - tier.includedContacts);
        const extraBlocks = Math.ceil(extraContacts / tier.extraUnit);
        return tier.base + (extraBlocks * tier.extraCost);
    }

    function calculateSalesPrice() {
        const tier = pricing.sales[state.sales.tier];
        return tier.base + ((state.sales.users - 1) * tier.extraPerUser);
    }

    function calculateServicePrice() {
        const tier = pricing.service[state.service.tier];
        return tier.base + ((state.service.users - 1) * tier.extraPerUser);
    }

    function calculateContentPrice() {
        return pricing.content[state.content.tier].base;
    }

    function calculateOperationsPrice() {
        return pricing.operations[state.operations.tier].base;
    }

    function addPriceElement(label, price) {
        const priceElement = document.createElement('div');
        priceElement.className = 'hub-price';
        priceElement.innerHTML = `
            <span class="hub-name">${label} (${capitalizeFirstLetter(state.mode === 'platform' ? state.platformTier : getHubTier(label))})</span>
            <span>${price.toLocaleString('fi-FI')} €/kk</span>
        `;
        hubPricesElement.appendChild(priceElement);
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