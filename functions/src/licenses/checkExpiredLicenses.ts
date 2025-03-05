
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Function that runs every day at midnight
export const checkExpiredLicenses = functions.pubsub
  .schedule('0 0 * * *') // Runs at midnight every day
  .onRun(async () => {
    try {
      const db = admin.firestore();
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Query all active licenses that have expired
      const licensesSnapshot = await db
        .collection('licenses')
        .where('status', '==', 'active')
        .where('endDate', '<', today)
        .get();
      
      if (licensesSnapshot.empty) {
        console.log('No licenses have expired today');
        return null;
      }
      
      const batch = db.batch();
      let expiredCount = 0;
      
      // Update all expired licenses to 'expired' status
      licensesSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { 
          status: 'expired',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        expiredCount++;
      });
      
      await batch.commit();
      
      console.log(`Successfully updated ${expiredCount} expired licenses`);
      return null;
    } catch (error) {
      console.error('Error checking expired licenses:', error);
      return null;
    }
  });
