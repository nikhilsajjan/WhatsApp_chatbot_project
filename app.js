// Configuration
const MEMBERSHIP_SIGNUP_URL = 'https://example.com/membership-signup';

const MEAL_OPTIONS = ['Vegan', 'Vegetarian', 'Omnivore (Meat or Fish)'];
const PAYMENT_METHODS = ['Card', 'Cash', 'Voucher'];
const DELIVERY_APPS = ['Deliveroo', 'Glovo'];
const POPUP_LOCATIONS = ['Parcheggio Astino Carservicefly', 'INTRALOT', 'Al Vilino Divino'];
const PICKUP_LOCATIONS = ['Parcheggio Astino Carservicefly', 'INTRALOT', 'Al Vilino Divino', 'Il Sole e La Terra'];
const TIME_SLOTS = [
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
    '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
    '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM'
];

// State definitions
const STATES = {
    MEAL_TYPE: 'MEAL_TYPE',
    MEAL_QUANTITY: 'MEAL_QUANTITY',
    ADD_MORE: 'ADD_MORE',
    PAYMENT_METHOD: 'PAYMENT_METHOD',
    VOUCHER_NUMBER: 'VOUCHER_NUMBER',
    VOUCHER_CONFIRM: 'VOUCHER_CONFIRM',
    MEMBERSHIP_CHECK: 'MEMBERSHIP_CHECK',
    MEMBERSHIP_NUMBER: 'MEMBERSHIP_NUMBER',
    MEMBERSHIP_WAITING: 'MEMBERSHIP_WAITING',
    CARD_PAYMENT_CONFIRM: 'CARD_PAYMENT_CONFIRM',
    CARD_PAYMENT_STATUS: 'CARD_PAYMENT_STATUS',
    CARD_PAYMENT_RETRY: 'CARD_PAYMENT_RETRY',
    DELIVERY_OPTIONS: 'DELIVERY_OPTIONS',
    DELIVERY_APP_SELECT: 'DELIVERY_APP_SELECT',
    DELIVERY_ADDRESS: 'DELIVERY_ADDRESS',
    DELIVERY_TRACKING: 'DELIVERY_TRACKING',
    POPUP_LOCATION: 'POPUP_LOCATION',
    POPUP_TIME: 'POPUP_TIME',
    PICKUP_LOCATION: 'PICKUP_LOCATION',
    PICKUP_TIME: 'PICKUP_TIME',
    SUMMARY: 'SUMMARY'
};

// Order data model
let order = {
    items: [],
    payment: {},
    delivery: {}
};

// Current state
let currentState = STATES.MEAL_TYPE;
let previousState = null;
let tempMealType = null;

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const quickRepliesContainer = document.getElementById('quickReplies');
const inputArea = document.getElementById('inputArea');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');

// Initialize
function init() {
    sendBtn.addEventListener('click', handleTextSubmit);
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleTextSubmit();
    });

    // Start conversation
    setTimeout(() => {
        transition(STATES.MEAL_TYPE, null);
    }, 500);
}

// FSM Transition Function
function transition(state, userInput) {
    previousState = currentState;
    currentState = state;

    switch (state) {
        case STATES.MEAL_TYPE:
            addBotMessage("Hi! What meal option would you like?");
            showQuickReplies(MEAL_OPTIONS);
            break;

        case STATES.MEAL_QUANTITY:
            tempMealType = userInput;
            addUserMessage(userInput);
            addBotMessage("How many would you like? (Type a number)");
            hideQuickReplies();
            break;

        case STATES.ADD_MORE:
            // Validate quantity
            const qty = parseInt(userInput);
            if (isNaN(qty) || qty <= 0) {
                addUserMessage(userInput);
                addBotMessage("Please enter a valid number greater than 0.");
                // Stay in MEAL_QUANTITY state
                currentState = STATES.MEAL_QUANTITY;
                return;
            }

            // Add item to order
            order.items.push({ type: tempMealType, qty: qty });
            addUserMessage(userInput);
            addBotMessage("Anything else to add?");
            showQuickReplies(['Yes', 'No']);
            break;

        case STATES.PAYMENT_METHOD:
            addUserMessage(userInput);
            if (userInput === 'Yes') {
                addBotMessage("Choose the next item:");
                showQuickReplies(MEAL_OPTIONS);
                currentState = STATES.MEAL_TYPE;
                // Don't call transition again, just update state
                return;
            } else {
                addBotMessage("How would you like to pay?");
                showQuickReplies(PAYMENT_METHODS);
            }
            break;

        case STATES.VOUCHER_NUMBER:
            addUserMessage(userInput);
            order.payment.method = 'Voucher';
            addBotMessage("Please enter your voucher number.");
            hideQuickReplies();
            break;

        case STATES.VOUCHER_CONFIRM:
            if (!userInput || userInput.trim() === '') {
                addUserMessage(userInput);
                addBotMessage("Voucher number cannot be empty. Please enter your voucher number.");
                currentState = STATES.VOUCHER_NUMBER;
                return;
            }

            order.payment.voucherNumber = userInput;
            addUserMessage(userInput);
            addBotMessage("Voucher received. Continue to delivery options?");
            showQuickReplies(['Continue', 'Restart']);
            break;

        case STATES.MEMBERSHIP_CHECK:
            addUserMessage(userInput);

            if (userInput === 'Card') {
                order.payment.method = 'Card';
            } else if (userInput === 'Cash') {
                order.payment.method = 'Cash';
            } else if (userInput === 'Continue') {
                // Coming from voucher confirmation
                transition(STATES.DELIVERY_OPTIONS, null);
                return;
            } else if (userInput === 'Restart') {
                restart();
                return;
            }

            addBotMessage("Do you have a membership number?");
            showQuickReplies(['Yes', 'No']);
            break;

        case STATES.MEMBERSHIP_NUMBER:
            addUserMessage(userInput);

            if (userInput === 'Yes') {
                addBotMessage("Type your membership number.");
                hideQuickReplies();
            } else if (userInput === 'No') {
                addBotMessage(`Get a membership here: <a href="${MEMBERSHIP_SIGNUP_URL}" target="_blank">${MEMBERSHIP_SIGNUP_URL}</a>. When you're done, come back and tap 'I have it'.`);
                currentState = STATES.MEMBERSHIP_WAITING;
                showQuickReplies(['I have it', 'Cancel order']);
            }
            break;

        case STATES.MEMBERSHIP_WAITING:
            addUserMessage(userInput);

            if (userInput === 'I have it') {
                addBotMessage("Type your membership number.");
                hideQuickReplies();
                currentState = STATES.MEMBERSHIP_NUMBER;
            } else if (userInput === 'Cancel order') {
                addBotMessage("Order cancelled. Let's start over!");
                setTimeout(() => restart(), 1000);
            }
            break;

        case STATES.CARD_PAYMENT_CONFIRM:
            if (!userInput || userInput.trim() === '') {
                addUserMessage(userInput);
                addBotMessage("Membership number cannot be empty. Please enter your membership number.");
                currentState = STATES.MEMBERSHIP_NUMBER;
                return;
            }

            order.payment.membershipNumber = userInput;
            addUserMessage(userInput);

            if (order.payment.method === 'Card') {
                addBotMessage("Proceed to card payment?");
                showQuickReplies(['Pay now', 'Cancel']);
            } else if (order.payment.method === 'Cash') {
                // Cash doesn't have payment gateway, go to delivery
                transition(STATES.DELIVERY_OPTIONS, null);
            }
            break;

        case STATES.CARD_PAYMENT_STATUS:
            addUserMessage(userInput);

            if (userInput === 'Pay now') {
                addBotMessage("Payment successful?");
                showQuickReplies(['Yes', 'No']);
            } else if (userInput === 'Cancel') {
                addBotMessage("Payment cancelled. Let's start over!");
                setTimeout(() => restart(), 1000);
            }
            break;

        case STATES.CARD_PAYMENT_RETRY:
            addUserMessage(userInput);

            if (userInput === 'Yes') {
                order.payment.paymentStatus = 'success';
                transition(STATES.DELIVERY_OPTIONS, null);
            } else if (userInput === 'No') {
                order.payment.paymentStatus = 'failed';
                addBotMessage("Try again or switch payment method?");
                showQuickReplies(['Try again', 'Switch to Cash', 'Switch to Voucher']);
            }
            break;

        case STATES.DELIVERY_OPTIONS:
            if (userInput === 'Try again') {
                addUserMessage(userInput);
                addBotMessage("Proceed to card payment?");
                showQuickReplies(['Pay now', 'Cancel']);
                currentState = STATES.CARD_PAYMENT_CONFIRM;
                return;
            } else if (userInput === 'Switch to Cash') {
                addUserMessage(userInput);
                order.payment.method = 'Cash';
                delete order.payment.paymentStatus;
                addBotMessage("Do you have a membership number?");
                showQuickReplies(['Yes', 'No']);
                currentState = STATES.MEMBERSHIP_CHECK;
                return;
            } else if (userInput === 'Switch to Voucher') {
                addUserMessage(userInput);
                order.payment = { method: 'Voucher' };
                addBotMessage("Please enter your voucher number.");
                hideQuickReplies();
                currentState = STATES.VOUCHER_NUMBER;
                return;
            }

            addBotMessage("Choose a delivery option:");
            showQuickReplies(['Delivery agent apps', 'Pop-up stores', 'Self pick up']);
            break;

        case STATES.DELIVERY_APP_SELECT:
            addUserMessage(userInput);
            order.delivery.type = 'delivery_app';
            addBotMessage("Which delivery app will you use?");
            showQuickReplies(DELIVERY_APPS);
            break;

        case STATES.DELIVERY_ADDRESS:
            addUserMessage(userInput);
            order.delivery.app = userInput;
            addBotMessage("Please share your delivery address (street, number, city) + any notes.");
            hideQuickReplies();
            break;

        case STATES.DELIVERY_TRACKING:
            order.delivery.address = userInput;
            addUserMessage(userInput);
            addBotMessage("After you place the order in the app, reply here with the order number (or screenshot) for tracking.");
            hideQuickReplies();
            break;

        case STATES.POPUP_LOCATION:
            addUserMessage(userInput);
            order.delivery.type = 'popup';
            addBotMessage("Choose a pop-up location:");
            showQuickReplies(POPUP_LOCATIONS);
            break;

        case STATES.POPUP_TIME:
            order.delivery.location = userInput;
            addUserMessage(userInput);
            addBotMessage("Choose a pickup time slot (12:00 PM–3:00 PM):");
            showQuickReplies(TIME_SLOTS);
            break;

        case STATES.PICKUP_LOCATION:
            addUserMessage(userInput);
            order.delivery.type = 'pickup';
            addBotMessage("Which pickup location do you want?");
            showQuickReplies(PICKUP_LOCATIONS);
            break;

        case STATES.PICKUP_TIME:
            order.delivery.location = userInput;
            addUserMessage(userInput);
            addBotMessage("Choose a pickup time slot (12:00 PM–3:00 PM):");
            showQuickReplies(TIME_SLOTS);
            break;

        case STATES.SUMMARY:
            if (previousState === STATES.DELIVERY_TRACKING) {
                order.delivery.tracking = userInput;
            } else if (previousState === STATES.POPUP_TIME || previousState === STATES.PICKUP_TIME) {
                order.delivery.time = userInput;
            }

            addUserMessage(userInput);

            // Generate summary
            let summary = "Summary:\n\n";

            // Items
            summary += "Items:\n";
            order.items.forEach(item => {
                summary += `• ${item.type} × ${item.qty}\n`;
            });
            summary += "\n";

            // Payment
            summary += `Payment: ${order.payment.method}\n`;
            if (order.payment.membershipNumber) {
                summary += `Membership: ${order.payment.membershipNumber}\n`;
            }
            if (order.payment.voucherNumber) {
                summary += `Voucher: ${order.payment.voucherNumber}\n`;
            }
            summary += "\n";

            // Delivery
            if (order.delivery.type === 'delivery_app') {
                summary += `Delivery: ${order.delivery.app}\n`;
                summary += `Address: ${order.delivery.address}\n`;
                summary += `Tracking: ${order.delivery.tracking}\n`;
            } else if (order.delivery.type === 'popup') {
                summary += `Pickup: Pop-up store\n`;
                summary += `Location: ${order.delivery.location}\n`;
                summary += `Time: ${order.delivery.time}\n`;
            } else if (order.delivery.type === 'pickup') {
                summary += `Pickup: Self pick up\n`;
                summary += `Location: ${order.delivery.location}\n`;
                summary += `Time: ${order.delivery.time}\n`;
            }

            summary += "\nNext step: ";
            if (order.delivery.type === 'delivery_app') {
                summary += "tracking details from delivery app";
            } else {
                summary += `pickup at ${order.delivery.location} at ${order.delivery.time}`;
            }

            addBotMessage(summary);
            showQuickReplies(['Restart']);
            break;
    }
}

// Handle user input
function handleUserInput(input) {
    const trimmedInput = input.trim();

    switch (currentState) {
        case STATES.MEAL_TYPE:
            if (MEAL_OPTIONS.includes(trimmedInput)) {
                transition(STATES.MEAL_QUANTITY, trimmedInput);
            }
            break;

        case STATES.MEAL_QUANTITY:
            transition(STATES.ADD_MORE, trimmedInput);
            break;

        case STATES.ADD_MORE:
            if (trimmedInput === 'Yes' || trimmedInput === 'No') {
                if (trimmedInput === 'Yes') {
                    transition(STATES.MEAL_TYPE, trimmedInput);
                } else {
                    transition(STATES.PAYMENT_METHOD, trimmedInput);
                }
            }
            break;

        case STATES.PAYMENT_METHOD:
            if (trimmedInput === 'Voucher') {
                transition(STATES.VOUCHER_NUMBER, trimmedInput);
            } else if (trimmedInput === 'Card' || trimmedInput === 'Cash') {
                transition(STATES.MEMBERSHIP_CHECK, trimmedInput);
            }
            break;

        case STATES.VOUCHER_NUMBER:
            transition(STATES.VOUCHER_CONFIRM, trimmedInput);
            break;

        case STATES.VOUCHER_CONFIRM:
            if (trimmedInput === 'Continue' || trimmedInput === 'Restart') {
                transition(STATES.MEMBERSHIP_CHECK, trimmedInput);
            }
            break;

        case STATES.MEMBERSHIP_CHECK:
            if (trimmedInput === 'Yes' || trimmedInput === 'No') {
                transition(STATES.MEMBERSHIP_NUMBER, trimmedInput);
            }
            break;

        case STATES.MEMBERSHIP_NUMBER:
            transition(STATES.CARD_PAYMENT_CONFIRM, trimmedInput);
            break;

        case STATES.MEMBERSHIP_WAITING:
            if (trimmedInput === 'I have it' || trimmedInput === 'Cancel order') {
                transition(STATES.MEMBERSHIP_WAITING, trimmedInput);
            }
            break;

        case STATES.CARD_PAYMENT_CONFIRM:
            if (trimmedInput === 'Pay now' || trimmedInput === 'Cancel') {
                transition(STATES.CARD_PAYMENT_STATUS, trimmedInput);
            }
            break;

        case STATES.CARD_PAYMENT_STATUS:
            if (trimmedInput === 'Yes' || trimmedInput === 'No') {
                transition(STATES.CARD_PAYMENT_RETRY, trimmedInput);
            }
            break;

        case STATES.CARD_PAYMENT_RETRY:
            transition(STATES.DELIVERY_OPTIONS, trimmedInput);
            break;

        case STATES.DELIVERY_OPTIONS:
            if (trimmedInput === 'Delivery agent apps') {
                transition(STATES.DELIVERY_APP_SELECT, trimmedInput);
            } else if (trimmedInput === 'Pop-up stores') {
                transition(STATES.POPUP_LOCATION, trimmedInput);
            } else if (trimmedInput === 'Self pick up') {
                transition(STATES.PICKUP_LOCATION, trimmedInput);
            }
            break;

        case STATES.DELIVERY_APP_SELECT:
            if (DELIVERY_APPS.includes(trimmedInput)) {
                transition(STATES.DELIVERY_ADDRESS, trimmedInput);
            }
            break;

        case STATES.DELIVERY_ADDRESS:
            transition(STATES.DELIVERY_TRACKING, trimmedInput);
            break;

        case STATES.DELIVERY_TRACKING:
            transition(STATES.SUMMARY, trimmedInput);
            break;

        case STATES.POPUP_LOCATION:
            if (POPUP_LOCATIONS.includes(trimmedInput)) {
                transition(STATES.POPUP_TIME, trimmedInput);
            }
            break;

        case STATES.POPUP_TIME:
            if (TIME_SLOTS.includes(trimmedInput)) {
                transition(STATES.SUMMARY, trimmedInput);
            }
            break;

        case STATES.PICKUP_LOCATION:
            if (PICKUP_LOCATIONS.includes(trimmedInput)) {
                transition(STATES.PICKUP_TIME, trimmedInput);
            }
            break;

        case STATES.PICKUP_TIME:
            if (TIME_SLOTS.includes(trimmedInput)) {
                transition(STATES.SUMMARY, trimmedInput);
            }
            break;

        case STATES.SUMMARY:
            if (trimmedInput === 'Restart') {
                restart();
            }
            break;
    }
}

// UI Functions
function addBotMessage(text) {
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = text;

        const footerDiv = document.createElement('div');
        footerDiv.className = 'message-footer';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = formatTime(Date.now());

        footerDiv.appendChild(timeSpan);
        bubbleDiv.appendChild(textDiv);
        bubbleDiv.appendChild(footerDiv);
        messageDiv.appendChild(bubbleDiv);

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }, 800 + Math.random() * 400);
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;

    const footerDiv = document.createElement('div');
    footerDiv.className = 'message-footer';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = formatTime(Date.now());

    footerDiv.appendChild(timeSpan);
    bubbleDiv.appendChild(textDiv);
    bubbleDiv.appendChild(footerDiv);
    messageDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showQuickReplies(options) {
    quickRepliesContainer.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = option;
        btn.onclick = () => handleUserInput(option);
        quickRepliesContainer.appendChild(btn);
    });

    quickRepliesContainer.classList.add('active');
}

function hideQuickReplies() {
    quickRepliesContainer.classList.remove('active');
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function handleTextSubmit() {
    const input = textInput.value.trim();
    if (input) {
        textInput.value = '';
        handleUserInput(input);
    }
}

function restart() {
    order = {
        items: [],
        payment: {},
        delivery: {}
    };
    tempMealType = null;
    previousState = null;
    currentState = STATES.MEAL_TYPE;
    chatMessages.innerHTML = '';
    hideQuickReplies();

    setTimeout(() => {
        transition(STATES.MEAL_TYPE, null);
    }, 500);
}

// Start the app
init();
