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
        marketingTier: 'starter',
        marketingContacts: 1000,
        salesTier: 'starter',
        salesUsers: 1,
        serviceTier: 'starter',
        serviceUsers: 1,
        contentTier: 'starter',
        operationsTier: 'starter'
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
            
            // Trigger change event for select elements
            if (input.tagName.toLowerCase() === 'select') {
                input.dispatchEvent(new Event('change'));
            }
            
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

    // Update input visibility based on tier selection
    function updateInputVisibility() {
        // Platform section
        const platformUsersWrapper = elements.platformUsersInput.closest('.input-group');
        if (platformUsersWrapper) {
            platformUsersWrapper.style.display = state.platformTier === 'none' ? 'none' : 'block';
        }

        // Marketing section
        const marketingContactsWrapper = elements.marketingContactsInput.closest('.input-group');
        if (marketingContactsWrapper) {
            marketingContactsWrapper.style.display = state.marketingTier === 'none' ? 'none' : 'block';
        }

        // Sales section
        const salesUsersWrapper = elements.salesUsersInput.closest('.input-group');
        if (salesUsersWrapper) {
            salesUsersWrapper.style.display = state.salesTier === 'none' ? 'none' : 'block';
        }

        // Service section
        const serviceUsersWrapper = elements.serviceUsersInput.closest('.input-group');
        if (serviceUsersWrapper) {
            serviceUsersWrapper.style.display = state.serviceTier === 'none' ? 'none' : 'block';
        }

        // Recalculate price when visibility changes
        calculatePrice();
    }

    // Calculate price based on selected options
    function calculatePrice() {
        try {
            let totalPrice = 0;
            const hubPrices = {};

            if (state.mode === 'platform') {
                totalPrice = calculatePlatformPrice();
                if (totalPrice > 0) {
                    hubPrices['HubSpot Platform'] = totalPrice;
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

            // Ensure totalPrice is a valid number
            totalPrice = isNaN(totalPrice) ? 0 : totalPrice;

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
        if (!tier || state.salesUsers === 0) return 0;
        return tier.base + ((state.salesUsers - 1) * tier.extraPerUser);
    }

    // Calculate service price
    function calculateServicePrice() {
        if (state.serviceTier === 'none') return 0;
        
        const tier = pricing.service[state.serviceTier];
        if (!tier || state.serviceUsers === 0) return 0;
        return tier.base + ((state.serviceUsers - 1) * tier.extraPerUser);
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

    // Update price display
    function updatePriceDisplay(totalPrice, hubPrices) {
        try {
            if (elements.hubPricesElement && elements.totalPriceElement) {
                // Format hub prices
                const hubPricesHtml = Object.entries(hubPrices).map(([name, price]) => `
                    <div class="hub-price">
                        <span class="hub-name">${escapeHtml(name)}</span>
                        <span class="hub-price-value">${formatPrice(price)}</span>
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
            if (elements.hubPricesElement) elements.hubPricesElement.innerHTML = '';
            if (elements.totalPriceElement) elements.totalPriceElement.textContent = formatPrice(0);
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