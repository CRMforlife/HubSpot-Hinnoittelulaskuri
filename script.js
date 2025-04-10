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
            let value = parseInt(input.value.replace(/\D/g, '')) || min;
            value = Math.max(min, Math.min(value, max));
            input.value = value;
            return value;
        } catch (error) {
            console.error('Error validating input:', error);
            input.value = min;
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
            
            // Reset state based on selected tab
            resetState(tab);
        });
    });

    // Reset state based on mode
    function resetState(mode) {
        state.mode = mode;

        if (mode === 'platform') {
            // Set platform defaults
            state.platformTier = 'starter';
            state.platformUsers = 1;
            
            // Reset custom hubs
            state.marketingTier = 'none';
            state.salesTier = 'none';
            state.serviceTier = 'none';
            state.contentTier = 'none';
            state.operationsTier = 'none';
        } else {
            // Reset platform
            state.platformTier = 'none';
            state.platformUsers = 1;
            
            // Reset custom hubs to none
            state.marketingTier = 'none';
            state.salesTier = 'none';
            state.serviceTier = 'none';
            state.contentTier = 'none';
            state.operationsTier = 'none';
            
            // Reset counts
            state.marketingContacts = 1000;
            state.salesUsers = 1;
            state.serviceUsers = 1;
        }

        // Update UI to match new state
        updateUIFromState();
        updateInputVisibility();
        calculatePrice();
    }

    // Update UI elements to match state
    function updateUIFromState() {
        // Update all form elements to match state
        elements.platformTierSelect.value = state.platformTier;
        elements.platformUsersInput.value = state.platformUsers;
        elements.marketingTierSelect.value = state.marketingTier;
        elements.marketingContactsInput.value = state.marketingContacts;
        elements.salesTierSelect.value = state.salesTier;
        elements.salesUsersInput.value = state.salesUsers;
        elements.serviceTierSelect.value = state.serviceTier;
        elements.serviceUsersInput.value = state.serviceUsers;
        elements.contentTierSelect.value = state.contentTier;
        elements.operationsTierSelect.value = state.operationsTier;
    }

    // Update state and UI
    function updateState(key, value) {
        // Log state change
        console.log('State update:', { key, value, oldValue: state[key] });

        // Validate numeric inputs
        if (key.includes('Users') || key.includes('Contacts')) {
            if (key === 'marketingContacts') {
                value = Math.max(1000, parseInt(value) || 1000);
            } else {
                value = Math.max(1, parseInt(value) || 1);
            }
        }

        // Update state
        state[key] = value;

        // Reset related values when tier changes to none
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
                case 'platformTier':
                    state.platformUsers = 1;
                    elements.platformUsersInput.value = '1';
                    break;
            }
        }

        // Ensure UI updates
        requestAnimationFrame(() => {
            updateInputVisibility();
            calculatePrice();
        });
    }

    // Calculate prices for each hub
    function calculatePlatformPrice() {
        const tier = state.platformTier;
        if (tier === 'none') return 0;

        const users = Math.max(1, state.platformUsers);
        const tierData = pricing.platform[tier];
        if (!tierData) return 0;

        if (tier === 'starter') {
            return tierData.base + (users * tierData.extraPerUser);
        } else {
            const includedUsers = tierData.includedUsers || 0;
            const extraUsers = Math.max(0, users - includedUsers);
            return tierData.base + (extraUsers * tierData.extraPerUser);
        }
    }

    function calculateMarketingPrice() {
        const tier = state.marketingTier;
        if (tier === 'none') return 0;

        const contacts = Math.max(1000, state.marketingContacts);
        const tierData = pricing.marketing[tier];
        if (!tierData) return 0;

        const includedContacts = tierData.includedContacts || 0;
        const extraContacts = Math.max(0, contacts - includedContacts);
        const extraUnits = Math.ceil(extraContacts / tierData.extraUnit);
        return tierData.base + (extraUnits * tierData.extraCost);
    }

    function calculateSalesPrice() {
        const tier = state.salesTier;
        if (tier === 'none') return 0;

        const users = Math.max(1, state.salesUsers);
        const tierData = pricing.sales[tier];
        if (!tierData) return 0;

        return tierData.base + ((users - 1) * tierData.extraPerUser);
    }

    function calculateServicePrice() {
        const tier = state.serviceTier;
        if (tier === 'none') return 0;

        const users = Math.max(1, state.serviceUsers);
        const tierData = pricing.service[tier];
        if (!tierData) return 0;

        return tierData.base + ((users - 1) * tierData.extraPerUser);
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

    // Calculate total price
    function calculatePrice() {
        let totalPrice = 0;
        let hubPrices = [];

        try {
            if (state.mode === 'platform') {
                const platformPrice = calculatePlatformPrice();
                if (platformPrice > 0) {
                    hubPrices.push({
                        name: 'HubSpot Platform',
                        price: platformPrice
                    });
                    totalPrice = platformPrice;
                }
            } else {
                // Calculate prices for each selected hub
                const hubCalculations = [
                    { name: 'Marketing Hub', calculator: calculateMarketingPrice },
                    { name: 'Sales Hub', calculator: calculateSalesPrice },
                    { name: 'Service Hub', calculator: calculateServicePrice },
                    { name: 'Content Hub', calculator: calculateContentPrice },
                    { name: 'Operations Hub', calculator: calculateOperationsPrice }
                ];

                hubCalculations.forEach(({ name, calculator }) => {
                    const price = calculator();
                    if (price > 0) {
                        hubPrices.push({ name, price });
                        totalPrice += price;
                    }
                });
            }

            // Force price display update
            const priceDisplay = hubPrices
                .map(hub => `<div class="hub-price">${escapeHtml(hub.name)}: ${formatPrice(hub.price)} €/kk</div>`)
                .join('');
            
            // Update DOM directly
            if (elements.hubPricesElement) {
                elements.hubPricesElement.innerHTML = priceDisplay;
            }
            
            if (elements.totalPriceElement) {
                elements.totalPriceElement.textContent = `${formatPrice(totalPrice)} €/kk`;
            }

            // Log for debugging
            console.log('Price calculation:', {
                mode: state.mode,
                hubPrices,
                totalPrice,
                displayPrice: formatPrice(totalPrice)
            });

        } catch (error) {
            console.error('Error calculating price:', error);
            if (elements.hubPricesElement) {
                elements.hubPricesElement.innerHTML = '';
            }
            if (elements.totalPriceElement) {
                elements.totalPriceElement.textContent = '0 €/kk';
            }
        }
    }

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

    // Helper function to escape HTML
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('fi-FI', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
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

        // Force initial price calculation
        updateUIFromState();
        updateInputVisibility();
        calculatePrice();

        // Log initial state
        console.log('Initial state:', state);
    }

    // Initialize the form
    try {
        initializeForm();
    } catch (error) {
        console.error('Error initializing form:', error);
    }
}); 