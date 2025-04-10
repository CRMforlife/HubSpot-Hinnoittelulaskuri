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
        operationsTierSelect: document.getElementById('operations-tier'),
        marketingPackageSelect: document.getElementById('marketing-package'),
        salesPackageSelect: document.getElementById('sales-package'),
        servicePackageSelect: document.getElementById('service-package'),
        contentPackageSelect: document.getElementById('content-package'),
        operationsPackageSelect: document.getElementById('operations-package')
    };

    // State management
    const state = {
        mode: 'platform',
        platformTier: 'starter',
        platformUsers: 1,
        marketingTier: 'none',
        marketingContacts: 1000,
        salesTier: 'none',
        salesUsers: 1,
        serviceTier: 'none',
        serviceUsers: 1,
        contentTier: 'none',
        operationsTier: 'none'
    };

    // Input validation with better error handling
    function validateNumberInput(input, min = 0, max = Infinity) {
        try {
            let value = parseInt(input.value.replace(/\D/g, ''));
            
            if (isNaN(value) || value < min) {
                value = min;
            }
            
            if (value > max) {
                value = max;
            }
            
            // Update input value to show the validated number
            input.value = value;
            
            return value;
        } catch (error) {
            console.error('Error validating input:', error);
            return min;
        }
    }

    // Tab functionality
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            elements.tabButtons.forEach(btn => btn.classList.remove('active'));
            elements.tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected button and content
            button.classList.add('active');
            const targetSection = document.getElementById(`${tab}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Update state mode
            state.mode = tab;
            
            // Reset all state values
            if (tab === 'platform') {
                updateState('platformTier', 'starter');
                updateState('platformUsers', 1);
            } else {
                updateState('platformTier', 'none');
                updateState('platformUsers', 1);
            }
            
            // Reset all custom hub values
            updateState('marketingTier', 'none');
            updateState('salesTier', 'none');
            updateState('serviceTier', 'none');
            updateState('contentTier', 'none');
            updateState('operationsTier', 'none');
        });
    });

    // Initialize tooltips
    function initializeTooltips() {
        const tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
        let activeTooltip = null;

        // Close tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (activeTooltip && !activeTooltip.contains(e.target)) {
                activeTooltip.classList.remove('active');
                activeTooltip = null;
                if (window.innerWidth <= 767) {
                    document.body.style.overflow = '';
                }
            }
        });

        tooltipTriggers.forEach(trigger => {
            // Add ARIA attributes
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('tabindex', '0');
            trigger.setAttribute('aria-label', 'Lisätietoja');

            // Handle click/touch events
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close previously active tooltip
                if (activeTooltip && activeTooltip !== trigger) {
                    activeTooltip.classList.remove('active');
                }

                // Toggle current tooltip
                trigger.classList.toggle('active');
                activeTooltip = trigger.classList.contains('active') ? trigger : null;

                // Prevent scrolling when tooltip is open on mobile
                if (window.innerWidth <= 767) {
                    document.body.style.overflow = activeTooltip ? 'hidden' : '';
                }
            });

            // Handle keyboard events
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    trigger.click();
                } else if (e.key === 'Escape' && activeTooltip) {
                    activeTooltip.classList.remove('active');
                    activeTooltip = null;
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('input[type="number"]');
    formInputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'number-input-wrapper';
        
        // Only wrap if not already wrapped
        if (!input.parentNode.classList.contains('number-input-wrapper')) {
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            const decrementBtn = document.createElement('button');
            decrementBtn.className = 'number-btn decrement';
            decrementBtn.textContent = '-';
            decrementBtn.type = 'button';
            decrementBtn.setAttribute('aria-label', 'Vähennä määrää');
            
            const incrementBtn = document.createElement('button');
            incrementBtn.className = 'number-btn increment';
            incrementBtn.textContent = '+';
            incrementBtn.type = 'button';
            incrementBtn.setAttribute('aria-label', 'Lisää määrää');

            wrapper.insertBefore(decrementBtn, input);
            wrapper.appendChild(incrementBtn);

            // Handle button clicks with debounce
            let timeout;
            const handleChange = (newValue) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    input.value = newValue;
                    input.dispatchEvent(new Event('input'));
                }, 100);
            };

            decrementBtn.addEventListener('click', () => {
                const min = parseInt(input.min) || 0;
                const step = parseInt(input.step) || 1;
                const newValue = Math.max(min, parseInt(input.value) - step);
                handleChange(newValue);
            });

            incrementBtn.addEventListener('click', () => {
                const step = parseInt(input.step) || 1;
                const max = parseInt(input.max) || Infinity;
                const newValue = Math.min(max, parseInt(input.value) + step);
                handleChange(newValue);
            });
        }

        // Handle direct input with debounce
        let inputTimeout;
        input.addEventListener('input', () => {
            clearTimeout(inputTimeout);
            inputTimeout = setTimeout(() => {
                const min = parseInt(input.min) || 0;
                const max = parseInt(input.max) || Infinity;
                validateNumberInput(input, min, max);
            }, 300);
        });
    });

    // Update input visibility based on tier selection
    function updateInputVisibility() {
        // Handle platform/custom mode visibility
        elements.platformSection.style.display = state.mode === 'platform' ? 'block' : 'none';
        elements.customHubSection.style.display = state.mode === 'custom' ? 'block' : 'none';

        // Platform section
        const platformUsersGroup = document.getElementById('platform-users-group');
        if (platformUsersGroup) {
            platformUsersGroup.style.display = state.platformTier === 'none' ? 'none' : 'block';
        }

        // Marketing section
        const marketingContactsGroup = document.getElementById('marketing-contacts-group');
        if (marketingContactsGroup) {
            marketingContactsGroup.style.display = state.marketingTier === 'none' ? 'none' : 'block';
        }

        // Sales section
        const salesUsersGroup = document.getElementById('sales-users-group');
        if (salesUsersGroup) {
            salesUsersGroup.style.display = state.salesTier === 'none' ? 'none' : 'block';
        }

        // Service section
        const serviceUsersGroup = document.getElementById('service-users-group');
        if (serviceUsersGroup) {
            serviceUsersGroup.style.display = state.serviceTier === 'none' ? 'none' : 'block';
        }
    }

    // Update state and UI
    function updateState(key, value) {
        // Update state
        state[key] = value;

        // Reset related values when tier is set to 'none'
        if (key.endsWith('Tier') && value === 'none') {
            switch(key) {
                case 'marketingTier':
                    state.marketingContacts = 1000;
                    elements.marketingContactsInput.value = '1000';
                    break;
                case 'salesTier':
                    state.salesUsers = 1;
                    elements.salesUsersInput.value = '1';
                    break;
                case 'serviceTier':
                    state.serviceUsers = 1;
                    elements.serviceUsersInput.value = '1';
                    break;
            }
        }

        // Update form elements
        switch(key) {
            case 'platformTier':
                elements.platformTierSelect.value = value;
                if (value === 'none') {
                    state.platformUsers = 1;
                    elements.platformUsersInput.value = '1';
                }
                break;
            case 'platformUsers':
                elements.platformUsersInput.value = value;
                break;
            case 'marketingTier':
                elements.marketingTierSelect.value = value;
                break;
            case 'marketingContacts':
                elements.marketingContactsInput.value = value;
                break;
            case 'salesTier':
                elements.salesTierSelect.value = value;
                break;
            case 'salesUsers':
                elements.salesUsersInput.value = value;
                break;
            case 'serviceTier':
                elements.serviceTierSelect.value = value;
                break;
            case 'serviceUsers':
                elements.serviceUsersInput.value = value;
                break;
            case 'contentTier':
                elements.contentTierSelect.value = value;
                break;
            case 'operationsTier':
                elements.operationsTierSelect.value = value;
                break;
        }

        // Update visibility and calculate price
        updateInputVisibility();
        calculatePrice();
    }

    // Calculate price based on selected options
    function calculatePrice() {
        let totalPrice = 0;
        let hubPrices = [];

        try {
            if (state.mode === 'platform') {
                if (state.platformTier !== 'none') {
                    const platformPrice = calculatePlatformPrice();
                    if (platformPrice > 0) {
                        hubPrices.push({
                            name: 'HubSpot Platform',
                            price: platformPrice
                        });
                        totalPrice = platformPrice;
                    }
                }
            } else {
                // Custom mode calculations
                if (state.marketingTier !== 'none') {
                    const marketingPrice = calculateMarketingPrice();
                    hubPrices.push({
                        name: 'Marketing Hub',
                        price: marketingPrice
                    });
                    totalPrice += marketingPrice;
                }

                if (state.salesTier !== 'none') {
                    const salesPrice = calculateSalesPrice();
                    hubPrices.push({
                        name: 'Sales Hub',
                        price: salesPrice
                    });
                    totalPrice += salesPrice;
                }

                if (state.serviceTier !== 'none') {
                    const servicePrice = calculateServicePrice();
                    hubPrices.push({
                        name: 'Service Hub',
                        price: servicePrice
                    });
                    totalPrice += servicePrice;
                }

                if (state.contentTier !== 'none') {
                    const contentPrice = calculateContentPrice();
                    hubPrices.push({
                        name: 'Content Hub',
                        price: contentPrice
                    });
                    totalPrice += contentPrice;
                }

                if (state.operationsTier !== 'none') {
                    const operationsPrice = calculateOperationsPrice();
                    hubPrices.push({
                        name: 'Operations Hub',
                        price: operationsPrice
                    });
                    totalPrice += operationsPrice;
                }
            }

            // Update price display
            if (hubPrices.length > 0) {
                elements.hubPricesElement.innerHTML = hubPrices
                    .map(hub => `<div class="hub-price">${escapeHtml(hub.name)}: ${formatPrice(hub.price)} €/kk</div>`)
                    .join('');
            } else {
                elements.hubPricesElement.innerHTML = '';
            }
            
            elements.totalPriceElement.textContent = `${formatPrice(totalPrice)} €/kk`;
        } catch (error) {
            console.error('Error calculating price:', error);
            elements.hubPricesElement.innerHTML = '';
            elements.totalPriceElement.textContent = '0 €/kk';
        }
    }

    function calculatePlatformPrice() {
        const tier = state.platformTier;
        const users = state.platformUsers;
        const tierData = pricing.platform[tier];

        if (tier === 'starter') {
            return tierData.base + (users * tierData.extraPerUser);
        } else {
            const extraUsers = Math.max(0, users - tierData.includedUsers);
            return tierData.base + (extraUsers * tierData.extraPerUser);
        }
    }

    function calculateMarketingPrice() {
        const tier = state.marketingTier;
        if (tier === 'none') return 0;
        
        const contacts = state.marketingContacts;
        const tierData = pricing.marketing[tier];

        if (!tierData) return 0;

        const extraContacts = Math.max(0, contacts - tierData.includedContacts);
        const extraUnits = Math.ceil(extraContacts / tierData.extraUnit);
        return tierData.base + (extraUnits * tierData.extraCost);
    }

    function calculateSalesPrice() {
        const tier = state.salesTier;
        if (tier === 'none') return 0;

        const users = state.salesUsers;
        const tierData = pricing.sales[tier];

        if (!tierData) return 0;

        return tierData.base + (users * tierData.extraPerUser);
    }

    function calculateServicePrice() {
        const tier = state.serviceTier;
        if (tier === 'none') return 0;

        const users = state.serviceUsers;
        const tierData = pricing.service[tier];

        if (!tierData) return 0;

        return tierData.base + (users * tierData.extraPerUser);
    }

    function calculateContentPrice() {
        const tier = state.contentTier;
        if (tier === 'none') return 0;

        const tierData = pricing.content[tier];
        return tierData ? tierData.base : 0;
    }

    function calculateOperationsPrice() {
        const tier = state.operationsTier;
        if (tier === 'none') return 0;

        const tierData = pricing.operations[tier];
        return tierData ? tierData.base : 0;
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('fi-FI', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Helper function to escape HTML
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize form with event listeners
    function initializeForm() {
        // Platform section
        elements.platformTierSelect.addEventListener('change', (e) => {
            updateState('platformTier', e.target.value);
        });

        elements.platformUsersInput.addEventListener('input', (e) => {
            updateState('platformUsers', validateNumberInput(e.target, 1));
        });

        // Marketing section
        elements.marketingTierSelect.addEventListener('change', (e) => {
            updateState('marketingTier', e.target.value);
        });

        elements.marketingContactsInput.addEventListener('input', (e) => {
            updateState('marketingContacts', validateNumberInput(e.target, 1000));
        });

        // Sales section
        elements.salesTierSelect.addEventListener('change', (e) => {
            updateState('salesTier', e.target.value);
        });

        elements.salesUsersInput.addEventListener('input', (e) => {
            updateState('salesUsers', validateNumberInput(e.target, 1));
        });

        // Service section
        elements.serviceTierSelect.addEventListener('change', (e) => {
            updateState('serviceTier', e.target.value);
        });

        elements.serviceUsersInput.addEventListener('input', (e) => {
            updateState('serviceUsers', validateNumberInput(e.target, 1));
        });

        // Content section
        elements.contentTierSelect.addEventListener('change', (e) => {
            updateState('contentTier', e.target.value);
        });

        // Operations section
        elements.operationsTierSelect.addEventListener('change', (e) => {
            updateState('operationsTier', e.target.value);
        });

        // Initialize tooltips
        initializeTooltips();

        // Initial visibility update and price calculation
        updateInputVisibility();
        calculatePrice();
    }

    // Initialize the form
    try {
        initializeForm();
    } catch (error) {
        console.error('Error initializing form:', error);
    }
}); 