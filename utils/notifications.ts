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

export async function scheduleHabitReminders(habits: any[] = []) {
    if (!Notifications) return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();

        // 1. Morning Reminder (8:00 AM)
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Win the day! 🚀',
                body: 'Your habits are waiting. Consistency is your superpower.',
                sound: true,
            },
            trigger: {
                hour: 8,
                minute: 0,
                repeats: true,
            } as any,
        });

        // 2. Evening Reminder (9:00 PM)
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Time for a check-in! 🌙',
                body: "How did your habits go today? Log them now to protect your streak.",
                sound: true,
            },
            trigger: {
                hour: 21,
                minute: 0,
                repeats: true,
            } as any,
        });

        // 3. Individual Habit Reminders
        for (const habit of habits) {
            if (habit.reminderTime) {
                try {
                    // Parse "08:30 AM" or "20:00"
                    const timeStr = habit.reminderTime.trim().toUpperCase();
                    let hour = 0;
                    let minute = 0;

                    if (timeStr.includes('AM') || timeStr.includes('PM')) {
                        // Handle 12-hour format
                        const [timePart, ampm] = timeStr.split(/\s+/);
                        let [h, m] = timePart.split(':').map(Number);
                        if (ampm === 'PM' && h < 12) h += 12;
                        if (ampm === 'AM' && h === 12) h = 0;
                        hour = h;
                        minute = m;
                    } else {
                        // Handle 24-hour format
                        [hour, minute] = timeStr.split(':').map(Number);
                    }

                    if (!isNaN(hour) && !isNaN(minute)) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: `Time for ${habit.name}! 🎯`,
                                body: habit.description || `Don't miss your ${habit.name} routine.`,
                                sound: true,
                            },
                            trigger: {
                                hour,
                                minute,
                                repeats: true,
                            } as any,
                        });
                        console.log(`Scheduled reminder for ${habit.name} at ${hour}:${minute}`);
                    }
                } catch (err) {
                    console.log(`Failed to schedule reminder for habit: ${habit.name}`, err);
                }
            }
        }

        console.log('HabitContext: Reminders (System + Habit Specific) scheduled.');
    } catch (e) {
        console.log('Schedule habit reminders error:', e);
    }
}

export async function scheduleDailyReminder(hour: number = 20, minute: number = 0) {
    if (!Notifications) return;
    try {
        // This is a legacy function now, we prefer scheduleHabitReminders
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
