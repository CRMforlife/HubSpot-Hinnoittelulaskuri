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
            
            // Update state and reset prices
            state.mode = tab;
            
            // Reset all state values when switching tabs
            if (tab === 'platform') {
                // Platform-tilan oletusarvot
                state.platformTier = 'starter';
                state.platformUsers = 1;
                state.marketingTier = 'none';
                state.salesTier = 'none';
                state.serviceTier = 'none';
                state.contentTier = 'none';
                state.operationsTier = 'none';
            } else {
                // Custom-tilan oletusarvot
                state.platformTier = 'none';
                state.platformUsers = 0;
                state.marketingTier = 'none';
                state.salesTier = 'none';
                state.serviceTier = 'none';
                state.contentTier = 'none';
                state.operationsTier = 'none';
            }
            
            // Reset input values
            elements.platformTierSelect.value = state.platformTier;
            elements.platformUsersInput.value = state.platformUsers;
            elements.marketingTierSelect.value = 'none';
            elements.salesTierSelect.value = 'none';
            elements.serviceTierSelect.value = 'none';
            elements.contentTierSelect.value = 'none';
            elements.operationsTierSelect.value = 'none';
            
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
        try {
            let totalPrice = 0;
            const hubPrices = {};

            // Reset prices when switching tabs
            if (state.mode === 'platform' && state.platformTier === 'none') {
                elements.totalPriceElement.textContent = formatPrice(0);
                elements.hubPricesElement.innerHTML = '';
                return;
            }

            if (state.mode === 'custom' && 
                state.marketingTier === 'none' && 
                state.salesTier === 'none' && 
                state.serviceTier === 'none' && 
                state.contentTier === 'none' && 
                state.operationsTier === 'none') {
                elements.totalPriceElement.textContent = formatPrice(0);
                elements.hubPricesElement.innerHTML = '';
                return;
            }

            if (state.mode === 'platform') {
                const platformPrice = calculatePlatformPrice();
                if (platformPrice > 0) {
                    hubPrices['HubSpot Platform'] = platformPrice;
                    totalPrice = platformPrice;
                }
            } else {
                // Custom solution pricing
                if (state.marketingTier !== 'none') {
                    const price = calculateMarketingPrice();
                    if (price > 0) {
                        hubPrices['Marketing Hub'] = price;
                        totalPrice += price;
                    }
                }
                if (state.salesTier !== 'none') {
                    const price = calculateSalesPrice();
                    if (price > 0) {
                        hubPrices['Sales Hub'] = price;
                        totalPrice += price;
                    }
                }
                if (state.serviceTier !== 'none') {
                    const price = calculateServicePrice();
                    if (price > 0) {
                        hubPrices['Service Hub'] = price;
                        totalPrice += price;
                    }
                }
                if (state.contentTier !== 'none') {
                    const price = calculateContentPrice();
                    if (price > 0) {
                        hubPrices['Content Hub'] = price;
                        totalPrice += price;
                    }
                }
                if (state.operationsTier !== 'none') {
                    const price = calculateOperationsPrice();
                    if (price > 0) {
                        hubPrices['Operations Hub'] = price;
                        totalPrice += price;
                    }
                }
            }

            // Update price display immediately
            if (elements.totalPriceElement) {
                elements.totalPriceElement.textContent = formatPrice(totalPrice);
            }

            // Update hub prices display
            if (elements.hubPricesElement) {
                const hubPricesHtml = Object.entries(hubPrices).map(([name, price]) => `
                    <div class="hub-price">
                        <span class="hub-name">${escapeHtml(name)}</span>
                        <span class="hub-price-value">${formatPrice(price)}</span>
                    </div>
                `).join('');
                elements.hubPricesElement.innerHTML = hubPricesHtml;
            }
        } catch (error) {
            console.error('Error calculating price:', error);
            if (elements.totalPriceElement) {
                elements.totalPriceElement.textContent = formatPrice(0);
            }
            if (elements.hubPricesElement) {
                elements.hubPricesElement.innerHTML = '';
            }
        }
    }

    // Calculate platform price
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

    // Calculate marketing price
    function calculateMarketingPrice() {
        if (state.marketingTier === 'none') return 0;
        
        const tier = pricing.marketing[state.marketingTier];
        if (!tier) return 0;
        
        const extraContacts = Math.max(0, state.marketingContacts - tier.includedContacts);
        const extraBlocks = Math.ceil(extraContacts / tier.extraUnit);
        return tier.base + (extraBlocks * tier.extraCost);
    }

    // Calculate sales price
    function calculateSalesPrice() {
        if (state.salesTier === 'none') return 0;
        
        const tier = pricing.sales[state.salesTier];
        if (!tier) return 0;
        
        if (state.salesTier === 'starter') {
            return tier.base + (state.salesUsers * tier.extraPerUser);
        } else {
            const extraUsers = Math.max(0, state.salesUsers - 1);
            return tier.base + (extraUsers * tier.extraPerUser);
        }
    }

    // Calculate service price
    function calculateServicePrice() {
        if (state.serviceTier === 'none') return 0;
        
        const tier = pricing.service[state.serviceTier];
        if (!tier) return 0;
        
        if (state.serviceTier === 'starter') {
            return tier.base + (state.serviceUsers * tier.extraPerUser);
        } else {
            const extraUsers = Math.max(0, state.serviceUsers - 1);
            return tier.base + (extraUsers * tier.extraPerUser);
        }
    }

    // Calculate content price
    function calculateContentPrice() {
        if (state.contentTier === 'none') return 0;
        
        const tier = pricing.content[state.contentTier];
        return tier ? tier.base : 0;
    }

    // Calculate operations price
    function calculateOperationsPrice() {
        if (state.operationsTier === 'none') return 0;
        
        const tier = pricing.operations[state.operationsTier];
        return tier ? tier.base : 0;
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