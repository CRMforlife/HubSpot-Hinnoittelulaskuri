// HubSpot hinnoittelulogiikka
document.addEventListener('DOMContentLoaded', function() {
    // Hinnoitteludata
    const pricing = {
        platform: {
            starter: {
                base: 0,
                extraPerUser: 15,
                includedUsers: 1
            },
            professional: {
                base: 1283,
                extraPerUser: 45,
                includedUsers: 5
            },
            enterprise: {
                base: 4610,
                extraPerUser: 75,
                includedUsers: 7
            }
        },
        marketing: {
            starter: {
                base: 15,
                extraPerUser: 15,
                includedUsers: 3
            },
            professional: {
                base: 792,
                extraPerUser: 45,
                includedUsers: 5
            },
            enterprise: {
                base: 3300,
                extraPerUser: 75,
                includedUsers: 5
            }
        },
        sales: {
            starter: {
                base: 0,
                extraPerUser: 15,
                includedUsers: 1
            },
            professional: {
                base: 0,
                extraPerUser: 90,
                includedUsers: 1
            },
            enterprise: {
                base: 0,
                extraPerUser: 150,
                includedUsers: 1
            }
        },
        service: {
            starter: {
                base: 0,
                extraPerUser: 15,
                includedUsers: 1
            },
            professional: {
                base: 0,
                extraPerUser: 90,
                includedUsers: 1
            },
            enterprise: {
                base: 0,
                extraPerUser: 150,
                includedUsers: 1
            }
        },
        content: {
            starter: {
                base: 15,
                extraPerUser: 45,
                includedUsers: 3
            },
            professional: {
                base: 441,
                extraPerUser: 75,
                includedUsers: 5
            },
            enterprise: {
                base: 1470,
                extraPerUser: 75,
                includedUsers: 5
            }
        },
        operations: {
            starter: {
                base: 15,
                extraPerUser: 15,
                includedUsers: 1
            },
            professional: {
                base: 711,
                extraPerUser: 45,
                includedUsers: 1
            },
            enterprise: {
                base: 1960,
                extraPerUser: 75,
                includedUsers: 1
            }
        }
    };

    // DOM elementit
    const elements = {
        platformTierSelect: document.getElementById('platform-tier'),
        platformUsersInput: document.getElementById('platform-users'),
        marketingTierSelect: document.getElementById('marketing-tier'),
        marketingContactsInput: document.getElementById('marketing-contacts'),
        salesTierSelect: document.getElementById('sales-tier'),
        salesUsersInput: document.getElementById('sales-users'),
        serviceTierSelect: document.getElementById('service-tier'),
        serviceUsersInput: document.getElementById('service-users'),
        contentTierSelect: document.getElementById('content-tier'),
        contentUsersInput: document.getElementById('content-users'),
        operationsTierSelect: document.getElementById('operations-tier'),
        operationsUsersInput: document.getElementById('operations-users'),
        marketingPackageSelect: document.getElementById('marketing-package'),
        salesPackageSelect: document.getElementById('sales-package'),
        servicePackageSelect: document.getElementById('service-package'),
        contentPackageSelect: document.getElementById('content-package'),
        operationsPackageSelect: document.getElementById('operations-package'),
        platformSection: document.getElementById('platform-section'),
        customHubSection: document.getElementById('custom-section'),
        hubPricesElement: document.getElementById('hub-prices'),
        totalPriceElement: document.getElementById('total-price'),
        tabButtons: document.querySelectorAll('.tab-button')
    };

    // State management
    const state = {
        mode: 'platform', // platform tai custom
        platformTier: 'starter',
        platformUsers: 1,
        marketingTier: 'none',
        marketingContacts: 1000,
        marketingUsers: 1,
        salesTier: 'none',
        salesUsers: 1,
        serviceTier: 'none',
        serviceUsers: 1,
        contentTier: 'none',
        contentUsers: 1,
        operationsTier: 'none',
        operationsUsers: 1,
        totalPrice: 0,
        hubPrices: {}
    };

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
        elements.contentUsersInput.value = state.contentUsers;
        elements.operationsTierSelect.value = state.operationsTier;
        elements.operationsUsersInput.value = state.operationsUsers;
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
                case 'contentTier':
                    state.contentUsers = 1;
                    elements.contentUsersInput.value = '1';
                    break;
                case 'operationsTier':
                    state.operationsUsers = 1;
                    elements.operationsUsersInput.value = '1';
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

    // Update input visibility based on state
    function updateInputVisibility() {
        // Platform section
        elements.platformSection.style.display = state.mode === 'platform' ? 'block' : 'none';
        elements.customHubSection.style.display = state.mode === 'custom' ? 'block' : 'none';

        // Marketing section
        const marketingUsersGroup = document.getElementById('marketing-users-group');
        if (marketingUsersGroup) {
            marketingUsersGroup.style.display = state.marketingTier !== 'none' ? 'block' : 'none';
        }

        // Sales section
        const salesUsersGroup = document.getElementById('sales-users-group');
        if (salesUsersGroup) {
            salesUsersGroup.style.display = state.salesTier !== 'none' ? 'block' : 'none';
        }

        // Service section
        const serviceUsersGroup = document.getElementById('service-users-group');
        if (serviceUsersGroup) {
            serviceUsersGroup.style.display = state.serviceTier !== 'none' ? 'block' : 'none';
        }

        // Content section
        const contentUsersGroup = document.getElementById('content-users-group');
        if (contentUsersGroup) {
            contentUsersGroup.style.display = state.contentTier !== 'none' ? 'block' : 'none';
        }

        // Operations section
        const operationsUsersGroup = document.getElementById('operations-users-group');
        if (operationsUsersGroup) {
            operationsUsersGroup.style.display = state.operationsTier !== 'none' ? 'block' : 'none';
        }
    }

    // Validate number input
    function validateNumberInput(input, minValue) {
        const value = parseInt(input.value) || minValue;
        return Math.max(minValue, value);
    }

    // Format price for display
    function formatPrice(price) {
        return price.toLocaleString('fi-FI', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Calculate total price
    function calculatePrice() {
        try {
            let total = 0;
            let hubPrices = {};

            if (state.mode === 'platform') {
                if (state.platformTier === 'none') {
                    state.totalPrice = 0;
                    state.hubPrices = {};
                    updatePriceDisplay();
                    return;
                }

                const tier = pricing.platform[state.platformTier];
                if (!tier) {
                    console.error('Virheellinen platform tier:', state.platformTier);
                    return;
                }

                // Laske perushinta
                total = tier.base;

                // Lisää käyttäjähinnat jos käyttäjiä on enemmän kuin sisältyy
                if (state.platformUsers > tier.includedUsers) {
                    const extraUsers = state.platformUsers - tier.includedUsers;
                    total += extraUsers * tier.extraPerUser;
                }

                hubPrices.platform = total;
            } else {
                // Marketing Hub
                if (state.marketingTier !== 'none') {
                    const tier = pricing.marketing[state.marketingTier];
                    if (tier) {
                        let hubTotal = tier.base;
                        
                        // Lisää käyttäjähinnat
                        if (state.marketingUsers > tier.includedUsers) {
                            const extraUsers = state.marketingUsers - tier.includedUsers;
                            hubTotal += extraUsers * tier.extraPerUser;
                        }
                        
                        // Lisää kontaktihinnat
                        if (state.marketingContacts > 1000) {
                            const extraContacts = state.marketingContacts - 1000;
                            const contactBlocks = Math.ceil(extraContacts / 1000);
                            hubTotal += contactBlocks * 46;
                        }
                        
                        total += hubTotal;
                        hubPrices.marketing = hubTotal;
                    }
                }

                // Sales Hub
                if (state.salesTier !== 'none') {
                    const tier = pricing.sales[state.salesTier];
                    if (tier) {
                        let hubTotal = tier.base;
                        if (state.salesUsers > tier.includedUsers) {
                            const extraUsers = state.salesUsers - tier.includedUsers;
                            hubTotal += extraUsers * tier.extraPerUser;
                        }
                        total += hubTotal;
                        hubPrices.sales = hubTotal;
                    }
                }

                // Service Hub
                if (state.serviceTier !== 'none') {
                    const tier = pricing.service[state.serviceTier];
                    if (tier) {
                        let hubTotal = tier.base;
                        if (state.serviceUsers > tier.includedUsers) {
                            const extraUsers = state.serviceUsers - tier.includedUsers;
                            hubTotal += extraUsers * tier.extraPerUser;
                        }
                        total += hubTotal;
                        hubPrices.service = hubTotal;
                    }
                }

                // Content Hub
                if (state.contentTier !== 'none') {
                    const tier = pricing.content[state.contentTier];
                    if (tier) {
                        let hubTotal = tier.base;
                        if (state.contentUsers > tier.includedUsers) {
                            const extraUsers = state.contentUsers - tier.includedUsers;
                            hubTotal += extraUsers * tier.extraPerUser;
                        }
                        total += hubTotal;
                        hubPrices.content = hubTotal;
                    }
                }

                // Operations Hub
                if (state.operationsTier !== 'none') {
                    const tier = pricing.operations[state.operationsTier];
                    if (tier) {
                        let hubTotal = tier.base;
                        if (state.operationsUsers > tier.includedUsers) {
                            const extraUsers = state.operationsUsers - tier.includedUsers;
                            hubTotal += extraUsers * tier.extraPerUser;
                        }
                        total += hubTotal;
                        hubPrices.operations = hubTotal;
                    }
                }
            }

            state.totalPrice = total;
            state.hubPrices = hubPrices;
            updatePriceDisplay();
        } catch (error) {
            console.error('Virhe hinnan laskennassa:', error);
            state.totalPrice = 0;
            state.hubPrices = {};
            updatePriceDisplay();
        }
    }

    // Update price display
    function updatePriceDisplay() {
        try {
            // Päivitä hub-hinnat
            elements.hubPricesElement.innerHTML = '';
            for (const [hub, price] of Object.entries(state.hubPrices)) {
                if (price > 0) {
                    const hubName = hub.charAt(0).toUpperCase() + hub.slice(1);
                    elements.hubPricesElement.innerHTML += `
                        <div class="hub-price">
                            ${hubName}: ${formatPrice(price)} €/kk
                        </div>
                    `;
                }
            }

            // Päivitä kokonaishinta
            elements.totalPriceElement.textContent = `${formatPrice(state.totalPrice)} €/kk`;
        } catch (error) {
            console.error('Virhe hinnan näyttämisessä:', error);
            elements.hubPricesElement.innerHTML = '';
            elements.totalPriceElement.textContent = '0 €/kk';
        }
    }

    // Initialize tooltips
    function initializeTooltips() {
        const tooltips = document.querySelectorAll('.tooltip-trigger');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', (e) => {
                const tooltipText = e.target.getAttribute('data-tooltip');
                if (tooltipText) {
                    const tooltipElement = document.createElement('div');
                    tooltipElement.className = 'tooltip';
                    tooltipElement.textContent = tooltipText;
                    document.body.appendChild(tooltipElement);

                    const rect = e.target.getBoundingClientRect();
                    tooltipElement.style.top = `${rect.bottom + 5}px`;
                    tooltipElement.style.left = `${rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2)}px`;
                }
            });

            tooltip.addEventListener('mouseleave', () => {
                const tooltipElement = document.querySelector('.tooltip');
                if (tooltipElement) {
                    tooltipElement.remove();
                }
            });
        });
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

        elements.contentUsersInput.addEventListener('input', (e) => {
            updateState('contentUsers', validateNumberInput(e.target, 1));
        });

        // Operations section
        elements.operationsTierSelect.addEventListener('change', (e) => {
            updateState('operationsTier', e.target.value);
        });

        elements.operationsUsersInput.addEventListener('input', (e) => {
            updateState('operationsUsers', validateNumberInput(e.target, 1));
        });

        // Tab switching
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update mode and reset state
                state.mode = tab;
                
                if (tab === 'platform') {
                    // Reset custom hub selections
                    state.marketingTier = 'none';
                    state.salesTier = 'none';
                    state.serviceTier = 'none';
                    state.contentTier = 'none';
                    state.operationsTier = 'none';
                    
                    // Reset input values
                    elements.marketingTierSelect.value = 'none';
                    elements.salesTierSelect.value = 'none';
                    elements.serviceTierSelect.value = 'none';
                    elements.contentTierSelect.value = 'none';
                    elements.operationsTierSelect.value = 'none';
                } else {
                    // Reset platform selection
                    state.platformTier = 'none';
                    state.platformUsers = 1;
                    
                    // Reset input values
                    elements.platformTierSelect.value = 'none';
                    elements.platformUsersInput.value = '1';
                }
                
                // Update UI and calculate price
                updateUIFromState();
                updateInputVisibility();
                calculatePrice();
            });
        });

        // Initialize tooltips
        initializeTooltips();

        // Force initial price calculation
        updateUIFromState();
        updateInputVisibility();
        calculatePrice();
    }

    // Test calculator functionality
    function testCalculator() {
        console.log('Aloitetaan laskurin testaus...');
        
        // Testi 1: Platform Professional 10 käyttäjällä
        state.platformTier = 'professional';
        state.platformUsers = 10;
        state.mode = 'platform';
        calculatePrice();
        console.log('Testi 1 - Platform Professional 10 käyttäjällä:', state.totalPrice);
        
        // Testi 2: Marketing Professional 7 käyttäjällä
        state.marketingTier = 'professional';
        state.marketingUsers = 7;
        state.mode = 'custom';
        calculatePrice();
        console.log('Testi 2 - Marketing Professional 7 käyttäjällä:', state.totalPrice);
        
        // Testi 3: Sales Professional 5 käyttäjällä
        state.salesTier = 'professional';
        state.salesUsers = 5;
        calculatePrice();
        console.log('Testi 3 - Sales Professional 5 käyttäjällä:', state.totalPrice);
        
        // Testi 4: Service Professional 3 käyttäjällä
        state.serviceTier = 'professional';
        state.serviceUsers = 3;
        calculatePrice();
        console.log('Testi 4 - Service Professional 3 käyttäjällä:', state.totalPrice);
        
        // Testi 5: Content Professional 6 käyttäjällä
        state.contentTier = 'professional';
        state.contentUsers = 6;
        calculatePrice();
        console.log('Testi 5 - Content Professional 6 käyttäjällä:', state.totalPrice);
        
        // Testi 6: Operations Professional 2 käyttäjällä
        state.operationsTier = 'professional';
        state.operationsUsers = 2;
        calculatePrice();
        console.log('Testi 6 - Operations Professional 2 käyttäjällä:', state.totalPrice);
        
        console.log('Laskurin testaus valmis!');
    }

    // Run tests after initialization
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Running price calculator tests...');
        runTests();
        console.log('Running test calculator...');
        testCalculator();
    });
}); 