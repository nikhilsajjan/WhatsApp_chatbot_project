# WhatsApp-Style Ordering Chatbot

A conversational chatbot interface for ordering meals and groceries, built with vanilla HTML, CSS, and JavaScript. Features a WhatsApp-like UI with message bubbles, typing indicators, and quick-reply buttons.

## Features

- **Dual Order Flows**: Choose between Meals or Groceries ordering
- **FSM-Based Conversation Flow**: Finite State Machine architecture for predictable state transitions
- **Meal Ordering**: Choose from Vegan, Vegetarian, or Omnivore options with quantity validation
- **Grocery Ordering**:
  - 20 items across 5 categories (Fruits, Vegetables, Grains, Meat, Dairy)
  - List-based selection with number input (e.g., "1, 3, 5")
  - Quantity input for each selected item (1-99)
  - Add more items option
- **Multiple Payment Methods**:
  - Card payment with membership requirement
  - Cash payment with membership requirement
  - Voucher payment
- **Membership Management**: Signup flow with external link integration
- **Delivery Options**:
  - Delivery agent apps (Deliveroo, Glovo)
  - Pop-up store pickup
  - Self pickup
- **WhatsApp-Style UI**:
  - Message bubbles (bot: white/left, user: green/right)
  - Typing indicators with animated dots
  - Quick-reply buttons
  - Timestamps on messages
  - Smooth animations
  - Responsive design

## Tech Stack

- Pure HTML5
- Pure CSS3
- Vanilla JavaScript (ES6+)
- Python HTTP Server (for local development)

**No frameworks, no build tools, no dependencies!**

## Project Structure

```
.
├── index.html       # Main HTML structure
├── styles.css       # WhatsApp-themed styling
├── app.js          # FSM logic and conversation flow
├── server.py       # Python HTTP server with no-cache headers
└── README.md       # This file
```

## Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/nikhilsajjan/WhatsApp_chatbot_project.git
   cd WhatsApp_chatbot_project
   ```

2. **Start the server**
   ```bash
   python3 server.py
   ```

3. **Open in browser**
   - Local access: `http://localhost:8000`
   - Network access: Use the IP address displayed in terminal (for testing on mobile/other devices)

4. **Start ordering!**
   - The chat automatically starts with "What would you like to order today?"
   - Choose between Meals or Groceries
   - Follow the prompts for your selected order type
   - View your complete order summary at the end

## Configuration

You can easily customize the chatbot by editing `app.js`:

- **Membership signup URL**: Change `MEMBERSHIP_SIGNUP_URL` constant
- **Meal options**: Modify `MEAL_OPTIONS` array
- **Grocery items**: Update `GROCERY_ITEMS` array (20 items with id, name, category)
- **Payment methods**: Update `PAYMENT_METHODS` array
- **Locations**: Edit `POPUP_LOCATIONS` and `PICKUP_LOCATIONS` arrays
- **Time slots**: Customize `TIME_SLOTS` array
- **Delivery apps**: Modify `DELIVERY_APPS` array

## Conversation Flow

### Initial Selection
- **Order Type**: Choose between "Meals" or "Groceries"

### Meal Flow
1. **Meal Selection Loop**
   - Choose meal type (Vegan/Vegetarian/Omnivore)
   - Enter quantity (validated: must be integer > 0)
   - Option to add more items

### Grocery Flow
1. **Grocery Selection**
   - View numbered list of 20 grocery items organized by category
   - Enter item numbers separated by commas (e.g., "1, 3, 5")
   - Input validation: numbers must be 1-20
2. **Quantity Input**
   - For each selected item, enter quantity (1-99)
   - Validation: must be integer between 1-99
   - Option to add more items

### Common Flow (Both Meal & Grocery)
2. **Payment Selection**
   - Card: Requires membership → Payment gateway → Success/Retry
   - Cash: Requires membership → Proceed to delivery
   - Voucher: Enter voucher number → Continue to delivery

3. **Delivery/Pickup**
   - Delivery apps: Select app → Enter address → Provide tracking
   - Pop-up stores: Choose location → Select time slot
   - Self pickup: Choose location → Select time slot

4. **Order Summary**
   - Complete breakdown of items, payment, and delivery details
   - Restart option to begin a new order

## Data Model

The order object structure:

**For Meal Orders:**
```javascript
order = {
  type: 'meal',
  items: [
    { type: 'Vegan', qty: 2 },
    { type: 'Omnivore (Meat or Fish)', qty: 1 }
  ],
  payment: {
    method: 'Card',
    membershipNumber: '123456',
    paymentStatus: 'success'
  },
  delivery: {
    type: 'delivery_app',
    app: 'Deliveroo',
    address: '123 Main St, City',
    tracking: 'ABC123'
  }
}
```

**For Grocery Orders:**
```javascript
order = {
  type: 'grocery',
  items: [
    { id: 1, name: 'Apple', category: 'Fruits', qty: 5 },
    { id: 9, name: 'Rice', category: 'Grains', qty: 2 },
    { id: 17, name: 'Milk', category: 'Dairy', qty: 3 }
  ],
  payment: {
    method: 'Voucher',
    voucherNumber: 'SAVE20'
  },
  delivery: {
    type: 'pickup',
    location: 'Al Vilino Divino',
    time: '2:00 PM'
  }
}
```

## Features in Detail

### FSM Implementation
- Single `transition(state, userInput)` function handles all state changes
- Dual flow architecture supporting both Meal and Grocery ordering
- 24+ distinct states for complete conversation coverage
- Previous state tracking for proper data capture

### Input Validation
- **Meal Flow**: Quantity validation (positive integers only)
- **Grocery Flow**:
  - Item selection validation (comma-separated numbers 1-20)
  - Quantity validation (integers 1-99)
  - Duplicate item prevention
- Non-empty validation for voucher and membership numbers
- Helpful error messages with reprompting

### Payment Flow
- Card payment with retry mechanism
- Payment method switching without losing order items
- Membership signup flow with external link
- Cancel order option at key decision points

### UI/UX
- Auto-scroll to newest messages
- Typing indicator before bot messages
- Quick-reply buttons for common choices
- Text input always available for custom answers
- WhatsApp color scheme (#075E54, #25D366, #DCF8C6)
- Responsive design for mobile and desktop

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

The server includes no-cache headers, so changes to HTML/CSS/JS are immediately visible on page refresh—perfect for rapid development and testing.

## License

This project is open source and available under the MIT License.

## Author

Nikhil Sajjan

## Acknowledgments

Built with assistance from Claude (Anthropic)
