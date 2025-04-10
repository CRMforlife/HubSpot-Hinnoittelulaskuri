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
        platformUsers: 0,
        marketingUsers: 0,
        salesUsers: 0,
        serviceUsers: 0,
        contentUsers: 0,
        operationsUsers: 0,
        marketingPackage: 'starter',
        salesPackage: 'starter',
        servicePackage: 'starter',
        contentPackage: 'starter',
        operationsPackage: 'starter'
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
            document.getElementById(`${tab}-section`).classList.add('active');
            
            // Update visibility
            elements.platformSection.style.display = tab === 'platform' ? 'block' : 'none';
            elements.customHubSection.style.display = tab === 'custom' ? 'block' : 'none';
            
            // Update state and recalculate
            state.mode = tab;
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

    // Initialize form
    function initializeForm() {
        // Set initial state
        state.mode = 'platform';
        
        // Set initial visibility
        elements.platformSection.style.display = 'block';
        elements.customHubSection.style.display = 'none';
        
        // Add event listeners to all number inputs
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => {
                const id = input.id;
                const value = validateNumberInput(input, parseInt(input.min) || 0);
                
                // Update state based on input id
                switch(id) {
                    case 'platform-users':
                        state.platformUsers = value;
                        break;
                    case 'marketing-users':
                        state.marketingUsers = value;
                        break;
                    case 'sales-users':
                        state.salesUsers = value;
                        break;
                    case 'service-users':
                        state.serviceUsers = value;
                        break;
                    case 'content-users':
                        state.contentUsers = value;
                        break;
                    case 'operations-users':
                        state.operationsUsers = value;
                        break;
                }
                
                calculatePrice();
            });
        });

        // Add event listeners to all package selects
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => {
                const id = select.id;
                const value = select.value;
                
                // Update state based on select id
                switch(id) {
                    case 'marketing-package':
                        state.marketingPackage = value;
                        break;
                    case 'sales-package':
                        state.salesPackage = value;
                        break;
                    case 'service-package':
                        state.servicePackage = value;
                        break;
                    case 'content-package':
                        state.contentPackage = value;
                        break;
                    case 'operations-package':
                        state.operationsPackage = value;
                        break;
                }
                
                calculatePrice();
            });
        });

        // Initialize tooltips
        initializeTooltips();
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
        try {
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

                // Add non-zero prices to the list
                if (marketingPrice > 0) hubPrices.push({ name: 'Marketing Hub', price: marketingPrice });
                if (salesPrice > 0) hubPrices.push({ name: 'Sales Hub', price: salesPrice });
                if (servicePrice > 0) hubPrices.push({ name: 'Service Hub', price: servicePrice });
                if (contentPrice > 0) hubPrices.push({ name: 'Content Hub', price: contentPrice });
                if (operationsPrice > 0) hubPrices.push({ name: 'Operations Hub', price: operationsPrice });

                totalPrice = marketingPrice + salesPrice + servicePrice + contentPrice + operationsPrice;
            }

            // Ensure prices are valid numbers
            totalPrice = isNaN(totalPrice) ? 0 : totalPrice;
            hubPrices = hubPrices.map(hub => ({
                ...hub,
                price: isNaN(hub.price) ? 0 : hub.price
            }));

            // Update UI
            updatePriceDisplay(totalPrice, hubPrices);
        } catch (error) {
            console.error('Error calculating price:', error);
            updatePriceDisplay(0, []);
        }
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
        try {
            if (elements.hubPricesElement && elements.totalPriceElement) {
                // Format hub prices
                const hubPricesHtml = hubPrices.map(hub => `
                    <div class="hub-price">
                        <span class="hub-name">${escapeHtml(hub.name)}</span>
                        <span class="hub-price-value">${formatPrice(hub.price)}</span>
                    </div>
                `).join('');

                // Update the display safely
                requestAnimationFrame(() => {
                    elements.hubPricesElement.innerHTML = hubPricesHtml;
                    elements.totalPriceElement.textContent = formatPrice(totalPrice);
                });
            }
        } catch (error) {
            console.error('Error updating price display:', error);
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