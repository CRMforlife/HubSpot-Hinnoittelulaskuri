// HubSpot hinnoittelulogiikka
document.addEventListener('DOMContentLoaded', function() {
    // Hinnoittelutiedot
    const pricing = {
        platform: {
            starter: { base: 0, user: 0 },
            professional: { base: 1283, user: 45 },
            enterprise: { base: 3200, user: 45 }
        },
        marketing: {
            starter: { base: 0, user: 0, contact: 0 },
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

    // Hinnan laskenta
    function calculatePrice() {
        let total = 0;

        if (state.mode === 'platform') {
            const tier = pricing.platform[state.platformTier];
            if (tier) {
                total += tier.base;
                if (state.platformUsers > 2) {
                    total += (state.platformUsers - 2) * tier.user;
                }
            }
        } else {
            // Marketing Hub
            if (state.marketingTier !== 'none') {
                const tier = pricing.marketing[state.marketingTier];
                if (tier) {
                    total += tier.base;
                    if (state.marketingUsers > 2) {
                        total += (state.marketingUsers - 2) * tier.user;
                    }
                    if (state.marketingContacts > 1000) {
                        const contactBlocks = Math.ceil((state.marketingContacts - 1000) / 1000);
                        total += contactBlocks * tier.contact;
                    }
                }
            }

            // Sales Hub
            if (state.salesTier !== 'none') {
                const tier = pricing.sales[state.salesTier];
                if (tier) {
                    total += state.salesUsers * tier.user;
                }
            }

            // Service Hub
            if (state.serviceTier !== 'none') {
                const tier = pricing.service[state.serviceTier];
                if (tier) {
                    total += state.serviceUsers * tier.user;
                }
            }

            // Content Hub
            if (state.contentTier !== 'none') {
                const tier = pricing.content[state.contentTier];
                if (tier) {
                    total += tier.base;
                    if (state.contentUsers > 5) {
                        total += (state.contentUsers - 5) * tier.user;
                    }
                }
            }

            // Operations Hub
            if (state.operationsTier !== 'none') {
                const tier = pricing.operations[state.operationsTier];
                if (tier) {
                    total += tier.base;
                    if (state.operationsUsers > 1) {
                        total += (state.operationsUsers - 1) * tier.user;
                    }
                }
            }
        }

        state.totalPrice = total;
        elements.totalPrice.textContent = `${total}€`;
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
        const isPlatform = state.mode === 'platform';
        const isCustom = !isPlatform;

        // Platform tab
        elements.platformTier.parentElement.style.display = isPlatform ? 'block' : 'none';
        elements.platformUsers.parentElement.style.display = isPlatform ? 'block' : 'none';

        // Custom tab
        elements.marketingTier.parentElement.style.display = isCustom ? 'block' : 'none';
        elements.marketingUsers.parentElement.style.display = isCustom && state.marketingTier !== 'none' ? 'block' : 'none';
        elements.marketingContacts.parentElement.style.display = isCustom && state.marketingTier !== 'none' ? 'block' : 'none';

        elements.salesTier.parentElement.style.display = isCustom ? 'block' : 'none';
        elements.salesUsers.parentElement.style.display = isCustom && state.salesTier !== 'none' ? 'block' : 'none';

        elements.serviceTier.parentElement.style.display = isCustom ? 'block' : 'none';
        elements.serviceUsers.parentElement.style.display = isCustom && state.serviceTier !== 'none' ? 'block' : 'none';

        elements.contentTier.parentElement.style.display = isCustom ? 'block' : 'none';
        elements.contentUsers.parentElement.style.display = isCustom && state.contentTier !== 'none' ? 'block' : 'none';

        elements.operationsTier.parentElement.style.display = isCustom ? 'block' : 'none';
        elements.operationsUsers.parentElement.style.display = isCustom && state.operationsTier !== 'none' ? 'block' : 'none';
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
                
                if (tab === 'platform') {
                    state.marketingTier = 'none';
                    state.salesTier = 'none';
                    state.serviceTier = 'none';
                    state.contentTier = 'none';
                    state.operationsTier = 'none';
                } else {
                    state.platformTier = 'starter';
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
            }
            updateInputVisibility();
            calculatePrice();
        });
        elements.operationsUsers.addEventListener('input', function() {
            state.operationsUsers = validateInput(this, 1, 1000);
            calculatePrice();
        });
    }

    // Testausfunktiot
    function testCalculator() {
        console.log('Aloitetaan laskurin testaus...');
        
        // Testi 1: Platform Professional 10 käyttäjällä
        state.mode = 'platform';
        state.platformTier = 'professional';
        state.platformUsers = 10;
        calculatePrice();
        console.log('Testi 1 - Platform Professional 10 käyttäjällä:', state.totalPrice);
        // Odotettu: 1283€ + (8 × 45€) = 1643€
        
        // Testi 2: Marketing Professional 7 käyttäjällä ja 2000 kontaktilla
        state.mode = 'custom';
        state.marketingTier = 'professional';
        state.marketingUsers = 7;
        state.marketingContacts = 2000;
        calculatePrice();
        console.log('Testi 2 - Marketing Professional 7 käyttäjällä ja 2000 kontaktilla:', state.totalPrice);
        // Odotettu: 792€ + (5 × 45€) + 46€ = 1063€
        
        // Testi 3: Sales Professional 5 käyttäjällä
        state.salesTier = 'professional';
        state.salesUsers = 5;
        calculatePrice();
        console.log('Testi 3 - Sales Professional 5 käyttäjällä:', state.totalPrice);
        // Odotettu: 5 × 90€ = 450€
        
        // Testi 4: Service Professional 3 käyttäjällä
        state.serviceTier = 'professional';
        state.serviceUsers = 3;
        calculatePrice();
        console.log('Testi 4 - Service Professional 3 käyttäjällä:', state.totalPrice);
        // Odotettu: 3 × 90€ = 270€
        
        // Testi 5: Content Professional 6 käyttäjällä
        state.contentTier = 'professional';
        state.contentUsers = 6;
        calculatePrice();
        console.log('Testi 5 - Content Professional 6 käyttäjällä:', state.totalPrice);
        // Odotettu: 441€ + (1 × 75€) = 516€
        
        // Testi 6: Operations Professional 2 käyttäjällä
        state.operationsTier = 'professional';
        state.operationsUsers = 2;
        calculatePrice();
        console.log('Testi 6 - Operations Professional 2 käyttäjällä:', state.totalPrice);
        // Odotettu: 711€ + (1 × 45€) = 756€
        
        // Testi 7: Yhdistetty ratkaisu
        state.mode = 'custom';
        state.marketingTier = 'professional';
        state.marketingUsers = 6;
        state.marketingContacts = 2000;
        state.salesTier = 'professional';
        state.salesUsers = 4;
        state.serviceTier = 'starter';
        state.serviceUsers = 2;
        state.contentTier = 'professional';
        state.contentUsers = 6;
        state.operationsTier = 'professional';
        state.operationsUsers = 2;
        calculatePrice();
        console.log('Testi 7 - Yhdistetty ratkaisu:', state.totalPrice);
        // Odotettu: 792€ + (4 × 45€) + 46€ + (4 × 90€) + (2 × 15€) + 441€ + (1 × 75€) + 711€ + (1 × 45€) = 2839€
        
        console.log('Laskurin testaus valmis!');
    }

    // Alusta laskuri
    function initializeCalculator() {
        initializeEventListeners();
        updateInputVisibility();
        calculatePrice();
        testCalculator(); // Suorita testit alustuksen yhteydessä
    }

    // Käynnistä laskuri
    initializeCalculator();
}); 