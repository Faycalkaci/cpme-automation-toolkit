
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const stripeWebhooks = functions.https.onRequest(async (req, res) => {
  const db = admin.firestore();
  const signature = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    console.error('Missing Stripe webhook secret');
    return res.status(500).send('Webhook secret not configured');
  }
  
  let event: Stripe.Event;
  
  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      req.rawBody.toString(),
      signature,
      endpointSecret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Find the license associated with this subscription
        if (session.subscription && typeof session.subscription === 'string') {
          await handleSubscriptionCreated(db, session.subscription, session.customer as string);
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          await handlePaymentSucceeded(db, invoice.subscription);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          await handlePaymentFailed(db, invoice.subscription);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(db, subscription.id);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).send({ received: true });
  } catch (error) {
    console.error(`Error processing webhook event: ${error}`);
    res.status(500).send(`Webhook processing error: ${error.message}`);
  }
});

// Helper functions for subscription management
async function handleSubscriptionCreated(
  db: FirebaseFirestore.Firestore, 
  subscriptionId: string, 
  customerId: string
) {
  try {
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Find the license with this subscription ID
    const licensesSnapshot = await db
      .collection('licenses')
      .where('stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    
    if (licensesSnapshot.empty) {
      // If no license exists, create a new one
      // This situation can happen if license was created through Stripe checkout
      const priceId = subscription.items.data[0].price.id;
      
      // Determine plan type based on price ID
      let plan: 'standard' | 'pro' | 'enterprise' = 'standard';
      let maxUsers = 1;
      
      if (priceId.includes('pro')) {
        plan = 'pro';
      } else if (priceId.includes('enterprise')) {
        plan = 'enterprise';
        maxUsers = 3;
      }
      
      // Calculate end date (1 year from now)
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      // Create a new license
      await db.collection('licenses').add({
        status: 'active',
        plan,
        users: 0,
        maxUsers,
        cpme: customerId, // Temporarily use customerId as CPME name
        startDate: new Date().toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        stripeSubscriptionId: subscriptionId,
        customerId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Created new license for subscription: ${subscriptionId}`);
    } else {
      // Update existing license
      const licenseDoc = licensesSnapshot.docs[0];
      await licenseDoc.ref.update({
        status: 'active',
        customerId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Updated license for subscription: ${subscriptionId}`);
    }
  } catch (error) {
    console.error(`Error handling subscription creation: ${error}`);
    throw error;
  }
}

async function handlePaymentSucceeded(
  db: FirebaseFirestore.Firestore, 
  subscriptionId: string
) {
  try {
    // Find the license with this subscription ID
    const licensesSnapshot = await db
      .collection('licenses')
      .where('stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    
    if (!licensesSnapshot.empty) {
      const licenseDoc = licensesSnapshot.docs[0];
      const license = licenseDoc.data();
      
      // Get subscription details from Stripe to find the renewal period
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // If this is a renewal, extend the license end date
      if (subscription.current_period_end) {
        const newEndDate = new Date(subscription.current_period_end * 1000)
          .toISOString()
          .split('T')[0];
        
        await licenseDoc.ref.update({
          status: 'active',
          endDate: newEndDate,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`Extended license until ${newEndDate} for subscription: ${subscriptionId}`);
      }
    }
  } catch (error) {
    console.error(`Error handling payment success: ${error}`);
    throw error;
  }
}

async function handlePaymentFailed(
  db: FirebaseFirestore.Firestore, 
  subscriptionId: string
) {
  try {
    // Find the license with this subscription ID
    const licensesSnapshot = await db
      .collection('licenses')
      .where('stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    
    if (!licensesSnapshot.empty) {
      // Don't expire the license immediately on first payment failure
      // Just log the failure for now - Stripe will retry payments
      console.log(`Payment failed for subscription: ${subscriptionId}`);
      
      // You could add a 'paymentFailed' flag to the license if needed
      await licensesSnapshot.docs[0].ref.update({
        paymentFailedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (error) {
    console.error(`Error handling payment failure: ${error}`);
    throw error;
  }
}

async function handleSubscriptionCanceled(
  db: FirebaseFirestore.Firestore, 
  subscriptionId: string
) {
  try {
    // Find the license with this subscription ID
    const licensesSnapshot = await db
      .collection('licenses')
      .where('stripeSubscriptionId', '==', subscriptionId)
      .limit(1)
      .get();
    
    if (!licensesSnapshot.empty) {
      // Mark license as expired
      await licensesSnapshot.docs[0].ref.update({
        status: 'expired',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Marked license as expired for canceled subscription: ${subscriptionId}`);
    }
  } catch (error) {
    console.error(`Error handling subscription cancellation: ${error}`);
    throw error;
  }
}
