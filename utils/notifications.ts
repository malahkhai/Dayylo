import { Platform } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;
let Device: any = null;

try {
    Notifications = require('expo-notifications');
    Device = require('expo-device');
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
} catch (e) {
    console.log('Notifications/Device module not available:', e);
}

export async function requestPermissionsAsync() {
    if (!Notifications || !Device.isDevice) return false;

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return finalStatus === 'granted';
    } catch (e) {
        console.log('Push notification permissions error:', e);
        return false;
    }
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
    }

    const hasPermission = await requestPermissionsAsync();
    if (!hasPermission) return null;

    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;

        if (!projectId) {
            console.log('Project ID not found');
            return null;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        return tokenData.data;
    } catch (e) {
        console.log('Error getting push token:', e);
        return null;
    }
}

export async function scheduleDailyReminder(hour: number = 20, minute: number = 0) {
    if (!Notifications) return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Time to track your habits! 🌟',
                body: "Don't break your streak! Hop in and log today's progress.",
            },
            trigger: {
                hour,
                minute,
                repeats: true,
            } as any,
        });
    } catch (e) {
        console.log('Schedule notification error:', e);
    }
}

export async function cancelDailyReminder() {
    if (!Notifications) return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
        console.log('Cancel notification error:', e);
    }
}
