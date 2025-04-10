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
            
            // Update state and reset values
            state.mode = tab;
            
            if (tab === 'platform') {
                // Reset platform values
                state.platformTier = 'starter';
                state.platformUsers = 1;
                elements.platformTierSelect.value = 'starter';
                elements.platformUsersInput.value = '1';
                
                // Reset custom values
                state.marketingTier = 'none';
                state.salesTier = 'none';
                state.serviceTier = 'none';
                state.contentTier = 'none';
                state.operationsTier = 'none';
                
                elements.marketingTierSelect.value = 'none';
                elements.salesTierSelect.value = 'none';
                elements.serviceTierSelect.value = 'none';
                elements.contentTierSelect.value = 'none';
                elements.operationsTierSelect.value = 'none';
            } else {
                // Reset platform values
                state.platformTier = 'none';
                state.platformUsers = 1;
                elements.platformTierSelect.value = 'none';
                elements.platformUsersInput.value = '1';
                
                // Reset custom values
                state.marketingTier = 'none';
                state.salesTier = 'none';
                state.serviceTier = 'none';
                state.contentTier = 'none';
                state.operationsTier = 'none';
                
                elements.marketingTierSelect.value = 'none';
                elements.salesTierSelect.value = 'none';
                elements.serviceTierSelect.value = 'none';
                elements.contentTierSelect.value = 'none';
                elements.operationsTierSelect.value = 'none';
            }
            
            // Update visibility and calculate price
            updateInputVisibility();
            calculatePrice();
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
            if (state.platformTier === 'none') {
                state.platformUsers = 1;
                if (elements.platformUsersInput) {
                    elements.platformUsersInput.value = '1';
                }
            }
        }

        // Marketing section
        const marketingContactsGroup = document.getElementById('marketing-contacts-group');
        if (marketingContactsGroup) {
            marketingContactsGroup.style.display = state.marketingTier === 'none' ? 'none' : 'block';
            if (state.marketingTier === 'none') {
                state.marketingContacts = 1000;
                if (elements.marketingContactsInput) {
                    elements.marketingContactsInput.value = '1000';
                }
            }
        }

        // Sales section
        const salesUsersGroup = document.getElementById('sales-users-group');
        if (salesUsersGroup) {
            salesUsersGroup.style.display = state.salesTier === 'none' ? 'none' : 'block';
            if (state.salesTier === 'none') {
                state.salesUsers = 1;
                if (elements.salesUsersInput) {
                    elements.salesUsersInput.value = '1';
                }
            }
        }

        // Service section
        const serviceUsersGroup = document.getElementById('service-users-group');
        if (serviceUsersGroup) {
            serviceUsersGroup.style.display = state.serviceTier === 'none' ? 'none' : 'block';
            if (state.serviceTier === 'none') {
                state.serviceUsers = 1;
                if (elements.serviceUsersInput) {
                    elements.serviceUsersInput.value = '1';
                }
            }
        }

        // Recalculate price after visibility updates
        calculatePrice();
    }

    // Initialize form with event listeners
    function initializeForm() {
        // Platform section
        elements.platformTierSelect.addEventListener('change', (e) => {
            state.platformTier = e.target.value;
            calculatePrice();
        });

        elements.platformUsersInput.addEventListener('input', (e) => {
            state.platformUsers = validateNumberInput(e.target, 1);
            calculatePrice();
        });

        // Marketing section
        elements.marketingTierSelect.addEventListener('change', (e) => {
            state.marketingTier = e.target.value;
            updateInputVisibility();
            calculatePrice();
        });

        elements.marketingContactsInput.addEventListener('input', (e) => {
            state.marketingContacts = validateNumberInput(e.target, 1000);
            calculatePrice();
        });

        // Sales section
        elements.salesTierSelect.addEventListener('change', (e) => {
            state.salesTier = e.target.value;
            updateInputVisibility();
            calculatePrice();
        });

        elements.salesUsersInput.addEventListener('input', (e) => {
            state.salesUsers = validateNumberInput(e.target, 1);
            calculatePrice();
        });

        // Service section
        elements.serviceTierSelect.addEventListener('change', (e) => {
            state.serviceTier = e.target.value;
            updateInputVisibility();
            calculatePrice();
        });

        elements.serviceUsersInput.addEventListener('input', (e) => {
            state.serviceUsers = validateNumberInput(e.target, 1);
            calculatePrice();
        });

        // Content section
        elements.contentTierSelect.addEventListener('change', (e) => {
            state.contentTier = e.target.value;
            calculatePrice();
        });

        // Operations section
        elements.operationsTierSelect.addEventListener('change', (e) => {
            state.operationsTier = e.target.value;
            calculatePrice();
        });

        // Initialize tooltips
        initializeTooltips();

        // Initial visibility update and price calculation
        updateInputVisibility();
        calculatePrice();
    }

    // Calculate price based on selected options
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
            // Custom mode calculations
            if (state.marketingTier !== 'none') {
                const marketingPrice = calculateMarketingPrice();
                if (marketingPrice > 0) {
                    hubPrices.push({
                        name: 'Marketing Hub',
                        price: marketingPrice
                    });
                    totalPrice += marketingPrice;
                }
            }

            if (state.salesTier !== 'none') {
                const salesPrice = calculateSalesPrice();
                if (salesPrice > 0) {
                    hubPrices.push({
                        name: 'Sales Hub',
                        price: salesPrice
                    });
                    totalPrice += salesPrice;
                }
            }

            if (state.serviceTier !== 'none') {
                const servicePrice = calculateServicePrice();
                if (servicePrice > 0) {
                    hubPrices.push({
                        name: 'Service Hub',
                        price: servicePrice
                    });
                    totalPrice += servicePrice;
                }
            }

            if (state.contentTier !== 'none') {
                const contentPrice = calculateContentPrice();
                if (contentPrice > 0) {
                    hubPrices.push({
                        name: 'Content Hub',
                        price: contentPrice
                    });
                    totalPrice += contentPrice;
                }
            }

            if (state.operationsTier !== 'none') {
                const operationsPrice = calculateOperationsPrice();
                if (operationsPrice > 0) {
                    hubPrices.push({
                        name: 'Operations Hub',
                        price: operationsPrice
                    });
                    totalPrice += operationsPrice;
                }
            }
        }

        // Update price display
        elements.hubPricesElement.innerHTML = hubPrices
            .map(hub => `<div class="hub-price">${escapeHtml(hub.name)}: ${formatPrice(hub.price)} €/kk</div>`)
            .join('');
        
        elements.totalPriceElement.textContent = `${formatPrice(totalPrice)} €/kk`;
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
        const contacts = state.marketingContacts;
        const tierData = pricing.marketing[tier];

        const extraContacts = Math.max(0, contacts - tierData.includedContacts);
        const extraUnits = Math.ceil(extraContacts / tierData.extraUnit);
        return tierData.base + (extraUnits * tierData.extraCost);
    }

    function calculateSalesPrice() {
        const tier = state.salesTier;
        const users = state.salesUsers;
        const tierData = pricing.sales[tier];

        return tierData.base + (users * tierData.extraPerUser);
    }

    function calculateServicePrice() {
        const tier = state.serviceTier;
        const users = state.serviceUsers;
        const tierData = pricing.service[tier];

        return tierData.base + (users * tierData.extraPerUser);
    }

    function calculateContentPrice() {
        const tier = state.contentTier;
        return pricing.content[tier].base;
    }

    function calculateOperationsPrice() {
        const tier = state.operationsTier;
        return pricing.operations[tier].base;
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

    // Initialize the form
    try {
        initializeForm();
    } catch (error) {
        console.error('Error initializing form:', error);
    }
}); 