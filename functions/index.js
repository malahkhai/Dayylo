const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

exports.sendDailyReminders = functions.pubsub
    .schedule('0 20 * * *')
    .timeZone('America/New_York') // Users receive this based on Eastern Time
    .onRun(async (context) => {
        try {
            // Get users with notifications enabled and a push token
            const usersSnapshot = await db.collection('users')
                .where('notificationsEnabled', '==', true)
                .get();

            const messages = [];

            usersSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.pushToken) {
                    messages.push({
                        to: data.pushToken,
                        sound: 'default',
                        title: 'Time to track your habits! 🌟',
                        body: "Don't break your streak! Hop in and log today's progress.",
                    });
                }
            });

            if (messages.length === 0) {
                console.log('No eligible users found for push notifications.');
                return null;
            }

            // Send in chunks of 100 per Expo's API limits
            const chunks = [];
            for (let i = 0; i < messages.length; i += 100) {
                chunks.push(messages.slice(i, i + 100));
            }

            for (const chunk of chunks) {
                await axios.post('https://exp.host/--/api/v2/push/send', chunk, {
                    headers: {
                        'Accept': 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    }
                });
            }

            console.log(`Successfully sent ${messages.length} daily reminders.`);
            return null;

        } catch (error) {
            console.error('Error sending daily reminders:', error);
            return null;
        }
    });
