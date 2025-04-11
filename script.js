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
        marketingUsersInput: document.getElementById('marketing-users'),
        salesTierSelect: document.getElementById('sales-tier'),
        salesUsersInput: document.getElementById('sales-users'),
        serviceTierSelect: document.getElementById('service-tier'),
        serviceUsersInput: document.getElementById('service-users'),
        contentTierSelect: document.getElementById('content-tier'),
        contentUsersInput: document.getElementById('content-users'),
        operationsTierSelect: document.getElementById('operations-tier'),
        operationsUsersInput: document.getElementById('operations-users'),
        platformSection: document.getElementById('platform-section'),
        customHubSection: document.getElementById('custom-section'),
        hubPricesElement: document.getElementById('hub-prices'),
        totalPriceElement: document.getElementById('total-price'),
        tabButtons: document.querySelectorAll('.tab-button')
    };

    // Tila
    const state = {
        mode: 'platform',
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
        operationsUsers: 1
    };

    // Apufunktiot
    function formatPrice(price) {
        return price.toLocaleString('fi-FI', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function validateNumberInput(input, minValue) {
        const value = parseInt(input.value) || minValue;
        return Math.max(minValue, value);
    }

    // Hinnan laskenta
    function calculatePrice() {
        let total = 0;
        let hubPrices = {};

        // Platform hinta
        if (state.mode === 'platform' && state.platformTier !== 'none') {
            const tier = pricing.platform[state.platformTier];
            if (tier) {
                let price = tier.base;
                if (state.platformUsers > tier.includedUsers) {
                    const extraUsers = state.platformUsers - tier.includedUsers;
                    price += extraUsers * tier.extraPerUser;
                }
                total += price;
                hubPrices.platform = price;
            }
        }

        // Marketing Hub hinta
        if (state.marketingTier !== 'none') {
            const tier = pricing.marketing[state.marketingTier];
            if (tier) {
                let price = tier.base;
                if (state.marketingUsers > tier.includedUsers) {
                    const extraUsers = state.marketingUsers - tier.includedUsers;
                    price += extraUsers * tier.extraPerUser;
                }
                if (state.marketingContacts > 1000) {
                    const extraContacts = state.marketingContacts - 1000;
                    const contactBlocks = Math.ceil(extraContacts / 1000);
                    price += contactBlocks * 46;
                }
                total += price;
                hubPrices.marketing = price;
            }
        }

        // Sales Hub hinta
        if (state.salesTier !== 'none') {
            const tier = pricing.sales[state.salesTier];
            if (tier) {
                let price = tier.base;
                if (state.salesUsers > tier.includedUsers) {
                    const extraUsers = state.salesUsers - tier.includedUsers;
                    price += extraUsers * tier.extraPerUser;
                }
                total += price;
                hubPrices.sales = price;
            }
        }

        // Service Hub hinta
        if (state.serviceTier !== 'none') {
            const tier = pricing.service[state.serviceTier];
            if (tier) {
                let price = tier.base;
                if (state.serviceUsers > tier.includedUsers) {
                    const extraUsers = state.serviceUsers - tier.includedUsers;
                    price += extraUsers * tier.extraPerUser;
                }
                total += price;
                hubPrices.service = price;
            }
        }

        // Content Hub hinta
        if (state.contentTier !== 'none') {
            const tier = pricing.content[state.contentTier];
            if (tier) {
                let price = tier.base;
                if (state.contentUsers > tier.includedUsers) {
                    const extraUsers = state.contentUsers - tier.includedUsers;
                    price += extraUsers * tier.extraPerUser;
                }
                total += price;
                hubPrices.content = price;
            }
        }

        // Operations Hub hinta
        if (state.operationsTier !== 'none') {
            const tier = pricing.operations[state.operationsTier];
            if (tier) {
                let price = tier.base;
                if (state.operationsUsers > tier.includedUsers) {
                    const extraUsers = state.operationsUsers - tier.includedUsers;
                    price += extraUsers * tier.extraPerUser;
                }
                total += price;
                hubPrices.operations = price;
            }
        }

        // Päivitä näkymä
        updatePriceDisplay(total, hubPrices);
    }

    // Hinnan näyttäminen
    function updatePriceDisplay(total, hubPrices) {
        // Hub-hinnat
        elements.hubPricesElement.innerHTML = '';
        for (const [hub, price] of Object.entries(hubPrices)) {
            if (price > 0) {
                const hubName = hub.charAt(0).toUpperCase() + hub.slice(1);
                elements.hubPricesElement.innerHTML += `
                    <div class="hub-price">
                        ${hubName}: ${formatPrice(price)} €/kk
                    </div>
                `;
            }
        }

        // Kokonaishinta
        elements.totalPriceElement.textContent = `${formatPrice(total)} €/kk`;
    }

    // Syötteiden näkyvyys
    function updateInputVisibility() {
        // Platform/Custom välilehti
        elements.platformSection.style.display = state.mode === 'platform' ? 'block' : 'none';
        elements.customHubSection.style.display = state.mode === 'custom' ? 'block' : 'none';

        // Hub-kohtaiset syötteet
        const sections = {
            marketing: document.getElementById('marketing-users-group'),
            sales: document.getElementById('sales-users-group'),
            service: document.getElementById('service-users-group'),
            content: document.getElementById('content-users-group'),
            operations: document.getElementById('operations-users-group')
        };

        for (const [hub, element] of Object.entries(sections)) {
            if (element) {
                element.style.display = state[`${hub}Tier`] !== 'none' ? 'block' : 'none';
            }
        }
    }

    // Tilan päivitys
    function updateState(key, value) {
        state[key] = value;

        // Nollaa liittyvät arvot kun tier vaihtuu 'none':ksi
        if (key.endsWith('Tier') && value === 'none') {
            const hub = key.replace('Tier', '');
            if (hub === 'marketing') {
                state.marketingContacts = 1000;
                state.marketingUsers = 1;
                elements.marketingContactsInput.value = '1000';
                elements.marketingUsersInput.value = '1';
            } else if (hub === 'platform') {
                state.platformUsers = 1;
                elements.platformUsersInput.value = '1';
            } else {
                state[`${hub}Users`] = 1;
                elements[`${hub}UsersInput`].value = '1';
            }
        }

        updateInputVisibility();
        calculatePrice();
    }

    // Tapahtumankäsittelijät
    function initializeEventListeners() {
        // Platform välilehti
        elements.platformTierSelect.addEventListener('change', (e) => {
            updateState('platformTier', e.target.value);
        });

        elements.platformUsersInput.addEventListener('input', (e) => {
            updateState('platformUsers', validateNumberInput(e.target, 1));
        });

        // Marketing Hub
        elements.marketingTierSelect.addEventListener('change', (e) => {
            updateState('marketingTier', e.target.value);
        });

        elements.marketingContactsInput.addEventListener('input', (e) => {
            updateState('marketingContacts', validateNumberInput(e.target, 1000));
        });

        elements.marketingUsersInput.addEventListener('input', (e) => {
            updateState('marketingUsers', validateNumberInput(e.target, 1));
        });

        // Sales Hub
        elements.salesTierSelect.addEventListener('change', (e) => {
            updateState('salesTier', e.target.value);
        });

        elements.salesUsersInput.addEventListener('input', (e) => {
            updateState('salesUsers', validateNumberInput(e.target, 1));
        });

        // Service Hub
        elements.serviceTierSelect.addEventListener('change', (e) => {
            updateState('serviceTier', e.target.value);
        });

        elements.serviceUsersInput.addEventListener('input', (e) => {
            updateState('serviceUsers', validateNumberInput(e.target, 1));
        });

        // Content Hub
        elements.contentTierSelect.addEventListener('change', (e) => {
            updateState('contentTier', e.target.value);
        });

        elements.contentUsersInput.addEventListener('input', (e) => {
            updateState('contentUsers', validateNumberInput(e.target, 1));
        });

        // Operations Hub
        elements.operationsTierSelect.addEventListener('change', (e) => {
            updateState('operationsTier', e.target.value);
        });

        elements.operationsUsersInput.addEventListener('input', (e) => {
            updateState('operationsUsers', validateNumberInput(e.target, 1));
        });

        // Välilehtien vaihto
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                
                // Päivitä aktiivinen välilehti
                elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Päivitä tila
                state.mode = tab;
                
                if (tab === 'platform') {
                    // Nollaa custom hub -valinnat
                    ['marketing', 'sales', 'service', 'content', 'operations'].forEach(hub => {
                        state[`${hub}Tier`] = 'none';
                        state[`${hub}Users`] = 1;
                        if (hub === 'marketing') {
                            state.marketingContacts = 1000;
                        }
                        elements[`${hub}TierSelect`].value = 'none';
                        elements[`${hub}UsersInput`].value = '1';
                        if (hub === 'marketing') {
                            elements.marketingContactsInput.value = '1000';
                        }
                    });
                } else {
                    // Nollaa platform-valinnat
                    state.platformTier = 'none';
                    state.platformUsers = 1;
                    elements.platformTierSelect.value = 'none';
                    elements.platformUsersInput.value = '1';
                }
                
                updateInputVisibility();
                calculatePrice();
            });
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
        // Odotettu: 1283€ + (5 × 45€) = 1508€
        
        // Testi 2: Marketing Professional 7 käyttäjällä ja 2000 kontaktilla
        state.mode = 'custom';
        state.marketingTier = 'professional';
        state.marketingUsers = 7;
        state.marketingContacts = 2000;
        calculatePrice();
        console.log('Testi 2 - Marketing Professional 7 käyttäjällä ja 2000 kontaktilla:', state.totalPrice);
        // Odotettu: 792€ + (2 × 45€) + 46€ = 928€
        
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
        // Odotettu: 792€ + (1 × 45€) + 46€ + (4 × 90€) + (2 × 15€) + 441€ + (1 × 75€) + 711€ + (1 × 45€) = 2699€
        
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