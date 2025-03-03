
// API Backend à déployer sur Hostinger
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Remplacer par l'URL de votre frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, customerId, successUrl, cancelUrl } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId || undefined,
    });
    
    res.json({ id: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await stripe.subscriptions.retrieve(id);
    
    res.json(subscription);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/subscriptions/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const canceledSubscription = await stripe.subscriptions.cancel(id);
    
    res.json(canceledSubscription);
  } catch (error) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { priceId } = req.body;
    
    const subscription = await stripe.subscriptions.retrieve(id);
    
    // Mettre à jour la subscription avec le nouveau plan
    const updatedSubscription = await stripe.subscriptions.update(id, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
    });
    
    res.json(updatedSubscription);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-customer-portal-session', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session du portail client:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook pour les événements Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Gérer les différents événements Stripe ici (paiement réussi, abonnement créé, etc.)
    switch (event.type) {
      case 'checkout.session.completed':
        // Logique pour un paiement réussi
        console.log('Paiement réussi:', event.data.object);
        break;
      case 'customer.subscription.created':
        // Logique pour un abonnement créé
        console.log('Abonnement créé:', event.data.object);
        break;
      case 'customer.subscription.updated':
        // Logique pour un abonnement mis à jour
        console.log('Abonnement mis à jour:', event.data.object);
        break;
      case 'customer.subscription.deleted':
        // Logique pour un abonnement supprimé
        console.log('Abonnement supprimé:', event.data.object);
        break;
      default:
        console.log(`Événement non géré: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Instructions de déploiement sur Hostinger:
// 1. Créez un hébergement Node.js sur Hostinger
// 2. Uploadez ce fichier dans le dossier de votre application
// 3. Installez les dépendances (express, cors, stripe) avec npm install
// 4. Configurez les variables d'environnement suivantes:
//    - STRIPE_SECRET_KEY: Votre clé secrète Stripe
//    - STRIPE_WEBHOOK_SECRET: Votre secret webhook Stripe
//    - FRONTEND_URL: L'URL de votre frontend
// 5. Démarrez l'application avec npm start ou node index.js
