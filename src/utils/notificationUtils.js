// src/utils/notificationUtils.js
import { messaging } from '../firebaseConfig';
import { getToken, onMessage } from 'firebase/messaging';

/**
 * Requests notification permission from the user and retrieves the FCM token.
 * @param {Function} showNotification - A callback function to display app-wide notifications.
 * @returns {Promise<string|null>} The FCM token if permission is granted, otherwise null.
 */
export const requestNotificationPermissionAndGetToken = async (showNotification) => {
    try {
        if (!('Notification' in window)) {
            showNotification('This browser does not support notifications.', 'error');
            console.warn('Notifications not supported in this browser.');
            return null;
        }

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Get FCM token
            const currentToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY_HERE' }); // REPLACE WITH YOUR ACTUAL VAPID KEY
            if (currentToken) {
                console.log('FCM registration token:', currentToken);
                showNotification('Notifications enabled!', 'success');
                // You might want to save this token to Firestore for sending targeted notifications later
                return currentToken;
            } else {
                // Show permission request UI
                showNotification('No FCM registration token available. Request permission to generate one.', 'info');
                console.warn('No FCM registration token available.');
                return null;
            }
        } else if (permission === 'denied') {
            showNotification('Notification permission denied. You will not receive push notifications.', 'error');
            console.warn('Notification permission denied.');
            return null;
        } else { // 'default'
            showNotification('Notification permission dismissed. You can enable it in your browser settings.', 'info');
            console.warn('Notification permission dismissed.');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        showNotification('Failed to set up notifications.', 'error');
        return null;
    }
};

/**
 * Listens for incoming FCM messages when the app is in the foreground.
 * @param {Function} showNotification - A callback function to display app-wide notifications.
 */
export const onMessageListener = (showNotification) => {
    // Check if messaging is initialized before setting up listener
    if (!messaging) {
        console.warn('Firebase Messaging not initialized. Cannot set up onMessage listener.');
        return;
    }

    onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);

        // Display a toast notification for the in-app message
        showNotification(payload.notification.body, 'info');

        // You can also create a custom notification UI here if desired
        // const notificationTitle = payload.notification.title;
        // const notificationOptions = {
        //     body: payload.notification.body,
        //     icon: '/logo192.png' // Optional: path to an icon for the notification
        // };
        // new Notification(notificationTitle, notificationOptions);
    });
};

/**
 * Checks the current notification permission status.
 * @returns {NotificationPermission} The current notification permission status ('granted', 'denied', or 'default').
 */
export const getNotificationPermissionStatus = () => {
    if ('Notification' in window) {
        return Notification.permission;
    }
    return 'unsupported'; // Custom string for unsupported
};
