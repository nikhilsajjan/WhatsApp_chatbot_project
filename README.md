# WhatsApp-Style Food Ordering Chatbot

A conversational chatbot interface for taking food orders, built with vanilla HTML, CSS, and JavaScript. Features a WhatsApp-like UI with message bubbles, typing indicators, and quick-reply buttons.

## Features

- **FSM-Based Conversation Flow**: Finite State Machine architecture for predictable state transitions
- **Meal Selection**: Choose from Vegan, Vegetarian, or Omnivore options with quantity validation
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
   - The chat automatically starts with a greeting
   - Follow the prompts to select meals, payment method, and delivery options
   - View your complete order summary at the end

## Configuration

You can easily customize the chatbot by editing `app.js`:

- **Membership signup URL**: Change `MEMBERSHIP_SIGNUP_URL` constant
- **Meal options**: Modify `MEAL_OPTIONS` array
- **Payment methods**: Update `PAYMENT_METHODS` array
- **Locations**: Edit `POPUP_LOCATIONS` and `PICKUP_LOCATIONS` arrays
- **Time slots**: Customize `TIME_SLOTS` array
- **Delivery apps**: Modify `DELIVERY_APPS` array

## Conversation Flow

1. **Meal Selection Loop**
   - Choose meal type (Vegan/Vegetarian/Omnivore)
   - Enter quantity (validated: must be integer > 0)
   - Option to add more items

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

```javascript
order = {
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

## Features in Detail

### FSM Implementation
- Single `transition(state, userInput)` function handles all state changes
- 21 distinct states for complete conversation coverage
- Previous state tracking for proper data capture

### Input Validation
- Quantity validation (positive integers only)
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
