// HubSpot hinnoittelulogiikka
document.addEventListener('DOMContentLoaded', function() {
    // Hinnoittelutiedot
    const pricing = {
        platform: {
            starter: { base: 0, user: 15 },
            professional: { base: 1283, includedUsers: 5, user: 45 },
            enterprise: { base: 3200, includedUsers: 7, user: 75 }
        },
        marketing: {
            starter: { base: 0, user: 0, contact: 46 },
            professional: { base: 792, user: 45, contact: 46 },
            enterprise: { base: 3200, user: 45, contact: 46 }
        },
        sales: {
            starter: { base: 0, user: 0 },
            professional: { base: 0, user: 90 },
            enterprise: { base: 0, user: 90 }
        },
        service: {
            starter: { base: 0, user: 15 },
            professional: { base: 0, user: 90 },
            enterprise: { base: 0, user: 90 }
        },
        content: {
            starter: { base: 0, user: 0 },
            professional: { base: 441, user: 75 },
            enterprise: { base: 3200, user: 75 }
        },
        operations: {
            starter: { base: 0, user: 0 },
            professional: { base: 711, user: 45 },
            enterprise: { base: 3200, user: 45 }
        }
    };

    // DOM-elementit
    const elements = {
        mode: document.querySelector('.tab-button'),
        platformTier: document.getElementById('platform-tier'),
        platformUsers: document.getElementById('platform-users'),
        marketingTier: document.getElementById('marketing-tier'),
        marketingUsers: document.getElementById('marketing-users'),
        marketingContacts: document.getElementById('marketing-contacts'),
        salesTier: document.getElementById('sales-tier'),
        salesUsers: document.getElementById('sales-users'),
        serviceTier: document.getElementById('service-tier'),
        serviceUsers: document.getElementById('service-users'),
        contentTier: document.getElementById('content-tier'),
        contentUsers: document.getElementById('content-users'),
        operationsTier: document.getElementById('operations-tier'),
        operationsUsers: document.getElementById('operations-users'),
        priceTitle: document.getElementById('price-title'),
        totalPrice: document.getElementById('total-price')
    };

    // Tila
    const state = {
        mode: 'platform',
        platformTier: 'starter',
        platformUsers: 1,
        marketingTier: 'none',
        marketingUsers: 1,
        marketingContacts: 1000,
        salesTier: 'none',
        salesUsers: 1,
        serviceTier: 'none',
        serviceUsers: 1,
        contentTier: 'none',
        contentUsers: 1,
        operationsTier: 'none',
        operationsUsers: 1,
        totalPrice: 0
    };

    // Hinnanlaskenta
    function calculatePrice() {
        let totalPrice = 0;
        
        if (state.mode === 'platform') {
            const platform = pricing.platform[state.platformTier];
            if (state.platformTier === 'starter') {
                // Starter: 15€/käyttäjä
                totalPrice = state.platformUsers * platform.user;
            } else if (state.platformTier === 'professional') {
                // Professional: 5 käyttäjää sisältyy, lisäkäyttäjät 45€/kpl
                const includedUsers = 5;
                if (state.platformUsers > includedUsers) {
                    totalPrice = platform.base + ((state.platformUsers - includedUsers) * platform.user);
                } else {
                    totalPrice = platform.base;
                }
            } else if (state.platformTier === 'enterprise') {
                // Enterprise: 7 käyttäjää sisältyy, lisäkäyttäjät 75€/kpl
                const includedUsers = 7;
                if (state.platformUsers > includedUsers) {
                    totalPrice = platform.base + ((state.platformUsers - includedUsers) * platform.user);
                } else {
                    totalPrice = platform.base;
                }
            }
        } else {
            // Marketing Hub
            if (state.marketingTier !== 'none') {
                const marketing = pricing.marketing[state.marketingTier];
                if (state.marketingTier === 'professional') {
                    // Professional sisältää 5 käyttäjää
                    const includedUsers = 5;
                    let userCost = 0;
                    if (state.marketingUsers > includedUsers) {
                        userCost = (state.marketingUsers - includedUsers) * marketing.user;
                    }
                    
                    // Laske kontaktien määrän perusteella lisähinta
                    let contactCost = 0;
                    if (state.marketingContacts > 1000) {
                        const contactBlocks = Math.ceil((state.marketingContacts - 1000) / 1000);
                        contactCost = contactBlocks * marketing.contact;
                    }
                    
                    totalPrice += marketing.base + userCost + contactCost;
                } else {
                    // Starter-taso
                    let userCost = (state.marketingUsers - 1) * marketing.user;
                    let contactCost = 0;
                    if (state.marketingContacts > 1000) {
                        const contactBlocks = Math.ceil((state.marketingContacts - 1000) / 1000);
                        contactCost = contactBlocks * marketing.contact;
                    }
                    totalPrice += marketing.base + userCost + contactCost;
                }
            }

            // Sales Hub
            if (state.salesTier !== 'none') {
                const sales = pricing.sales[state.salesTier];
                if (state.salesTier === 'professional') {
                    totalPrice += state.salesUsers * sales.user;
                } else {
                    totalPrice += sales.base + ((state.salesUsers - 1) * sales.user);
                }
            }

            // Service Hub
            if (state.serviceTier !== 'none') {
                const service = pricing.service[state.serviceTier];
                if (state.serviceTier === 'professional') {
                    totalPrice += state.serviceUsers * service.user;
                } else {
                    totalPrice += service.base + ((state.serviceUsers - 1) * service.user);
                }
            }

            // Content Hub
            if (state.contentTier !== 'none') {
                const content = pricing.content[state.contentTier];
                if (state.contentTier === 'professional') {
                    // Professional sisältää 1 käyttäjän
                    const includedUsers = 1;
                    if (state.contentUsers > includedUsers) {
                        totalPrice += content.base + ((state.contentUsers - includedUsers) * content.user);
                    } else {
                        totalPrice += content.base;
                    }
                } else {
                    totalPrice += content.base + ((state.contentUsers - 1) * content.user);
                }
            }

            // Operations Hub
            if (state.operationsTier !== 'none') {
                const operations = pricing.operations[state.operationsTier];
                if (state.operationsTier === 'professional') {
                    // Professional sisältää 1 käyttäjän
                    const includedUsers = 1;
                    if (state.operationsUsers > includedUsers) {
                        totalPrice += operations.base + ((state.operationsUsers - includedUsers) * operations.user);
                    } else {
                        totalPrice += operations.base;
                    }
                } else {
                    totalPrice += operations.base + ((state.operationsUsers - 1) * operations.user);
                }
            }
        }

        // Päivitä hinta näytölle
        elements.totalPrice.textContent = `${totalPrice}€/kk`;
    }

    // Syötteiden validointi
    function validateInput(input, min, max) {
        let value = parseInt(input.value);
        if (isNaN(value) || value < min) value = min;
        if (value > max) value = max;
        input.value = value;
        return value;
    }

    // Syötekenttien näkyvyyden päivitys
    function updateInputVisibility() {
        // Marketing Hub
        const marketingInputs = document.querySelectorAll('.marketing-input');
        marketingInputs.forEach(input => {
            input.style.display = state.marketingTier !== 'none' ? 'block' : 'none';
        });

        // Sales Hub
        const salesInputs = document.querySelectorAll('.sales-input');
        salesInputs.forEach(input => {
            input.style.display = state.salesTier !== 'none' ? 'block' : 'none';
        });

        // Service Hub
        const serviceInputs = document.querySelectorAll('.service-input');
        serviceInputs.forEach(input => {
            input.style.display = state.serviceTier !== 'none' ? 'block' : 'none';
        });

        // Content Hub
        const contentInputs = document.querySelectorAll('.content-input');
        contentInputs.forEach(input => {
            input.style.display = state.contentTier !== 'none' ? 'block' : 'none';
        });

        // Operations Hub
        const operationsInputs = document.querySelectorAll('.operations-input');
        operationsInputs.forEach(input => {
            input.style.display = state.operationsTier !== 'none' ? 'block' : 'none';
        });
    }

    // Tapahtumankuuntelijat
    function initializeEventListeners() {
        // Tab-vaihto
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                state.mode = tab;
                
                // Päivitä aktiivinen välilehti
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Päivitä näkyvät osiot
                document.getElementById('platform-section').classList.toggle('active', tab === 'platform');
                document.getElementById('custom-section').classList.toggle('active', tab === 'custom');
                
                // Nollaa arvot
                if (tab === 'platform') {
                    // Nollaa custom-tabin arvot
                    state.marketingTier = 'none';
                    state.salesTier = 'none';
                    state.serviceTier = 'none';
                    state.contentTier = 'none';
                    state.operationsTier = 'none';
                    state.marketingUsers = 1;
                    state.marketingContacts = 1000;
                    state.salesUsers = 1;
                    state.serviceUsers = 1;
                    state.contentUsers = 1;
                    state.operationsUsers = 1;
                    
                    // Päivitä pudotusvalikot
                    elements.marketingTier.value = 'none';
                    elements.salesTier.value = 'none';
                    elements.serviceTier.value = 'none';
                    elements.contentTier.value = 'none';
                    elements.operationsTier.value = 'none';
                    
                    // Päivitä syöttökentät
                    elements.marketingUsers.value = 1;
                    elements.marketingContacts.value = 1000;
                    elements.salesUsers.value = 1;
                    elements.serviceUsers.value = 1;
                    elements.contentUsers.value = 1;
                    elements.operationsUsers.value = 1;
                } else {
                    // Nollaa platform-tabin arvot
                    state.platformTier = 'starter';
                    state.platformUsers = 1;
                    
                    // Päivitä pudotusvalikko
                    elements.platformTier.value = 'starter';
                    elements.platformUsers.value = 1;
                }
                
                updateInputVisibility();
                calculatePrice();
            });
        });

        // Platform
        elements.platformTier.addEventListener('change', function() {
            state.platformTier = this.value;
            calculatePrice();
        });
        elements.platformUsers.addEventListener('input', function() {
            state.platformUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });

        // Marketing
        elements.marketingTier.addEventListener('change', function() {
            state.marketingTier = this.value;
            if (state.marketingTier === 'none') {
                state.marketingUsers = 1;
                state.marketingContacts = 1000;
                elements.marketingUsers.value = 1;
                elements.marketingContacts.value = 1000;
            }
            updateInputVisibility();
            calculatePrice();
        });
        elements.marketingUsers.addEventListener('input', function() {
            state.marketingUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });
        elements.marketingContacts.addEventListener('input', function() {
            state.marketingContacts = validateInput(this, 1000, 1000000);
            calculatePrice();
        });

        // Sales
        elements.salesTier.addEventListener('change', function() {
            state.salesTier = this.value;
            if (state.salesTier === 'none') {
                state.salesUsers = 1;
                elements.salesUsers.value = 1;
            }
            updateInputVisibility();
            calculatePrice();
        });
        elements.salesUsers.addEventListener('input', function() {
            state.salesUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });

        // Service
        elements.serviceTier.addEventListener('change', function() {
            state.serviceTier = this.value;
            if (state.serviceTier === 'none') {
                state.serviceUsers = 1;
                elements.serviceUsers.value = 1;
            }
            updateInputVisibility();
            calculatePrice();
        });
        elements.serviceUsers.addEventListener('input', function() {
            state.serviceUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });

        // Content
        elements.contentTier.addEventListener('change', function() {
            state.contentTier = this.value;
            if (state.contentTier === 'none') {
                state.contentUsers = 1;
                elements.contentUsers.value = 1;
            }
            updateInputVisibility();
            calculatePrice();
        });
        elements.contentUsers.addEventListener('input', function() {
            state.contentUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });

        // Operations
        elements.operationsTier.addEventListener('change', function() {
            state.operationsTier = this.value;
            if (state.operationsTier === 'none') {
                state.operationsUsers = 1;
                elements.operationsUsers.value = 1;
            }
            updateInputVisibility();
            calculatePrice();
        });
        elements.operationsUsers.addEventListener('input', function() {
            state.operationsUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });
    }

    // Alusta laskuri
    function initializeCalculator() {
        initializeEventListeners();
        updateInputVisibility();
        calculatePrice();
    }

    // Käynnistä laskuri
    initializeCalculator();
}); 