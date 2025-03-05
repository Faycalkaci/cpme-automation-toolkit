
# Firebase Cloud Functions

This directory contains Firebase Cloud Functions for the CPME Tool application.

## Functions

### License Management

- **checkExpiredLicenses**: Runs daily to automatically expire licenses that have reached their end date.

### Stripe Webhooks

- **stripeWebhooks**: Handles Stripe events such as:
  - `checkout.session.completed`: When a customer successfully completes checkout
  - `invoice.payment_succeeded`: When an invoice is paid successfully
  - `invoice.payment_failed`: When a payment attempt fails
  - `customer.subscription.deleted`: When a subscription is canceled

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set the required environment variables:
   ```
   firebase functions:config:set stripe.secret_key="YOUR_STRIPE_SECRET_KEY" stripe.webhook_secret="YOUR_STRIPE_WEBHOOK_SECRET"
   ```

3. Deploy the functions:
   ```
   npm run deploy
   ```

## Local Development

1. Start the Firebase emulators:
   ```
   npm run serve
   ```

2. For testing Stripe webhooks locally, use Stripe CLI:
   ```
   stripe listen --forward-to http://localhost:5001/your-project-id/us-central1/stripeWebhooks
   ```
