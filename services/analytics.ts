import analytics from '@react-native-firebase/analytics';
import appsFlyer from 'react-native-appsflyer';
import { Platform } from 'react-native';

class AnalyticsService {
    private isInitialized = false;

    async init() {
        if (this.isInitialized) return;

        try {
            // AppsFlyer initialization
            // Note: The devKey is already provided in app.json via the Expo plugin, 
            // but we still call initSdk to set up listeners and handle options.
            appsFlyer.initSdk(
                {
                    devKey: 'pSod3dnLRpDm8aDbaV3HbL',
                    isDebug: true,
                    appId: Platform.OS === 'ios' ? '6759918121' : '',
                    onInstallConversionDataListener: true,
                    onDeepLinkListener: true,
                    timeToWaitForATTUserAuthorization: 10, // seconds
                },
                (result) => {
                    console.log('AppsFlyer initSdk result:', result);
                },
                (error) => {
                    console.error('AppsFlyer initSdk error:', error);
                }
            );

            this.isInitialized = true;
            console.log('AnalyticsService: Initialized successfully');
        } catch (error) {
            console.error('AnalyticsService: Initialization failed', error);
        }
    }

    async logEvent(name: string, params: any = {}) {
        try {
            // Log to Firebase GA4
            await analytics().logEvent(name, params);
            console.log(`AnalyticsService: Event logged to Firebase -> ${name}`, params);

            // Log to AppsFlyer
            // We strip non-primitive params for AppsFlyer as it prefers flat structures
            const appsFlyerParams = this.formatParamsForAppsFlyer(params);
            
            appsFlyer.logEvent(
                name,
                appsFlyerParams,
                (result) => {
                    console.log(`AppsFlyer: Event logged -> ${name} result:`, result);
                },
                (error) => {
                    console.error(`AppsFlyer: Event error -> ${name} error:`, error);
                }
            );
        } catch (error) {
            console.error(`AnalyticsService: Failed to log event -> ${name}`, error);
        }
    }

    private formatParamsForAppsFlyer(params: any): any {
        const formatted: any = {};
        for (const key in params) {
            if (typeof params[key] !== 'object') {
                formatted[key] = params[key];
            } else {
                formatted[key] = JSON.stringify(params[key]);
            }
        }
        return formatted;
    }

    async setUserId(userId: string) {
        try {
            await analytics().setUserId(userId);
            appsFlyer.setCustomerUserId(userId, (res) => {
                console.log('AppsFlyer: CustomerUserId set', res);
            });
        } catch (error) {
            console.error('AnalyticsService: Failed to set userId', error);
        }
    }
}

export const Analytics = new AnalyticsService();
