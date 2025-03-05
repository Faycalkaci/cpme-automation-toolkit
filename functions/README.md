
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
   
   Important: Replace "YOUR_STRIPE_SECRET_KEY" with your actual Stripe secret key, but never commit this key to your repository.

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

## Configuration Instructions

To configure your Stripe integration for production:

1. Install the Firebase CLI globally if you haven't already:
   ```
   npm install -g firebase-tools
   ```

2. Log in to your Firebase account:
   ```
   firebase login
   ```

3. Set your Stripe secret key and webhook secret:
   ```
   firebase functions:config:set stripe.secret_key="sk_test_51QxqR102BN9qFxUQvlXRAN6cPMPJjqMvxGoZc1K9k4WbGhOdMy8OScECgB7vmm3QfKBA1XZSP9emXphxl4T3gzj90080txNpvU" stripe.webhook_secret="whsec_your_webhook_secret"
   ```

4. Deploy your functions:
   ```
   cd functions
   npm run deploy
   ```

5. After deployment, set up the webhook in your Stripe dashboard:
   - Go to Developers > Webhooks
   - Add an endpoint with your Firebase function URL
   - The URL will be: `https://us-central1-[YOUR-PROJECT-ID].cloudfunctions.net/stripeWebhooks`
   - Select events to listen for: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`

